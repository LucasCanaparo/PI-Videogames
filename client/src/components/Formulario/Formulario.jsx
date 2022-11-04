import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  postVideogame,
  getGenres,
  getVideogames,
  getPlatforms,
} from "../../Redux/Actions/index";
import { useDispatch, useSelector } from "react-redux";
import s from "./Formulario.module.css";
import { useTextValidation } from "../../Validaciones/validaciones";

export default function VideoGameCreate() {
  const dispatch = useDispatch();
  const history = useHistory(); //proporcionar información adicional que podemos utilizar dentro de nuestros componentes -> lo uso para volver al /home
  const { genres, platforms } = useSelector((state) => state);
  const [errors, setErrors] = useState({}); //es una array de errores para las validaciones

  const initialState = {
    //este estado inicial es que se va a llenar con la info en los inputs
    name: "",
    background_image: "",
    rating: "",
    description_raw: "",
    released: "",
    platforms: [],
    genres: [],
  };

  const initialChange = {
    //estado que contiene boleanos que cambian cuando se modifican mis inputs
    name: false,
    background_image: false,
    rating: false,
    description_raw: false,
    released: false,
    platforms: false,
    genres: false,
  };

  const [input, setInput] = useState(initialState); //estado inicial

  const [changes, setChanges] = useState(initialChange); //esto se usa para validar

  const validateUrl = /(http(s?):)([/|.|\w|\s|-])*.(?:jpg|gif|png)/;

  //funcion que valida mis inputs
  function validate(submit) {
    let errorsCopy = { ...errors }; //hace una copia del estado de errores para guardar ahi los errores que valide
    if (changes.name || submit) {
      //si hubo cambios en el input o se submitio valida la info
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const nameValidation = useTextValidation({
        //esta info es la que recibe la funcion (useTextValidation) en el archivo validaciones.js
        formInput: input.name,
        minLength: 5,
        maxLength: 15,
        displayText: "Name",
        required: true,
        regEx: /^[a-zA-Z ]*$/,
        negateRegEx: true,
        regExDisplay: "Numbers or symbols are not allowed",
      });
      typeof nameValidation === "string" //si nameValidation es de tipo string
        ? (errorsCopy.name = nameValidation) //me guarda en la var errorsCopy.name el string dado
        : delete errorsCopy.name; //si no hay str vacia el estado de errores
    }
    if (changes.background_image || submit) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const imageValidation = useTextValidation({
        formInput: input.background_image,
        displayText: "Image",
        regEx: validateUrl,
        regExDisplay: "Invalid URL",
        negateRegEx: true,
      });

      typeof imageValidation === "string"
        ? (errorsCopy.background_image = imageValidation)
        : delete errorsCopy.background_image;
    }

    if (changes.description_raw || submit) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const descriptionValidation = useTextValidation({
        formInput: input.description_raw,
        displayText: "Description",
        maxLength: 300,
        minLength: 10,
        required: true,
      });

      typeof descriptionValidation === "string"
        ? (errorsCopy.description_raw = descriptionValidation)
        : delete errorsCopy.description_raw;
    }

    if (changes.platforms || submit) {
      //si es menos a cero ->  sea no hay nada da el mensaje de error de al menos 1 es requerida
      if (input.platforms.length <= 0) {
        errorsCopy.platforms = "At least one platform is required";
      } else if (input.platforms.length > 5) {
        //si es mayor a 5 igual
        errorsCopy.platforms = "Cannot be more than 5 platforms";
        //y sino borra el estado de errores
      } else delete errorsCopy.platforms;
    }
    if (changes.genres || submit) {
      if (input.genres.length <= 0) {
        errorsCopy.genres = "At least one gender is required";
      } else if (input.genres.length > 5) {
        errorsCopy.genres = "Cannot be more than 5 gendres";
      } else delete errorsCopy.genres;
    }

    if (Object.keys(errorsCopy).length > 0) {
      //object.key me devuelve el nombre de la propiedad en un array
      //si hay algo en la variable de errores(errorsCopy) -> o sea es mayor a cero
      setErrors(errorsCopy); //mete esa info en el estado -> errors
      return false;
    } else {
      setErrors({}); //y si no hay nada lo limpia
      return true;
    }
  }

  useEffect(() => {
    dispatch(getGenres());
    dispatch(getPlatforms());
    return () => {
      dispatch(getVideogames());
    };
  }, [dispatch]);

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]); //si hay un cambio en el estado input -> ejecuta la funcion validate
  //esto es gracias al useEffect

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value, //cuando hay cambios modifica el estado input
    });
    setChanges({
      ...changes,
      [e.target.name]: true, //y el estado changes
    });
  }
  //el [e.target.name] hace referencia al name del input

  function handleSubmit(e) {
    //cuando apreto el boton create
    e.preventDefault(); //cancela el evento

    if (validate(true)) {
      //o sea no hay errores
      const inputCopy = { ...input }; //hace una copia del estado input
      if (!input.background_image) delete inputCopy.background_image; //si no hay la background_image la borra de la variable
      //le envia la info al postVideogame
      dispatch(postVideogame(inputCopy)).then((res) => {
        //res -> return del postVideogame
        if (res) {
          //si hay una respuesta buena
          alert("Game create!");
          setInput(initialState); //reinicia el estado input
          setChanges(initialChange); //reinicia el estado change
          history.push("/home"); //me envia al home
        } else {
          alert("Something is going wrong!");
        }
      });
    }
  }

  //usada en platforms y genres
  function handleSelect(e) {
    const { name, value } = e.target; //la casilla que elijo del checkbox
    if (input[name].includes(value)) {
      //si input tiene un [name] que incluye un value
      setInput({
        //modifica el estado
        ...input,
        [name]: input[name].filter((p) => p !== value), //y lo agrega al [name] del estado
      });
      return;
    }
    if (input[name].length < 5) {
      //si es menor a 5 los elegidos
      setInput({
        ...input,
        [name]: [...input[name], value], //lo agrega al [name] del estado
      });
    } else {
      alert("The maximum of platforms is 5");
    }
    setChanges({
      ...changes,
      [name]: true, //cambia el [name] a true en el esatdo changes
    });
  }
  return (
    <div className={s.fondoForm}>
      <h1 className={s.h1Form}>Create your videogame!</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label className={s.nameForm}>Name:</label>
          <input
            className={`${s.inputs}`}
            type="text"
            value={input.name}
            name="name"
            onChange={handleChange}
          />
          {errors.name && errors.name !== " " ? (
            <p className={s.pErrors}>{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label className={s.labelForm}>Image: </label>
          <input
            className={s.inputs}
            type="text"
            value={input.background_image}
            name="background_image"
            onChange={handleChange}
          />
          {errors.background_image && (
            <h3 className={s.pErrors}>{errors.background_image}</h3>
          )}
        </div>

        <div>
          <label className={s.ratingForm}>Rating:</label>
          <input
            className={s.inputs}
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={input.rating}
            name="rating"
            onChange={handleChange}
          />
          {errors.rating && <p className={s.pErrors}>{errors.rating}</p>}
        </div>

        <div>
          <label className={s.descForm}>Description:</label>
          <textarea name="description_raw" onChange={handleChange} />
          {errors.description_raw && (
            <p className={s.pErrors}>{errors.description_raw}</p>
          )}
        </div>

        <div>
          <label className={s.releasedForm}>Released:</label>
          <input type="date" name="released" onChange={handleChange} />
          {errors.released && <p className={s.pErrors}>{errors.released}</p>}
        </div>

        <div>
          <div className={s.divlabelPlatforms}>
            <h2>
              <label className={s.platformsForm}>Platforms:</label>
            </h2>
          </div>

          <div className={s.divPlatform}>
            {platforms?.map((p, i) => (
              <div className={s.divColumnaPlatforma} key={i}>
                <input
                  disabled={
                    input.platforms.length === 5 && !input.platforms.includes(p)
                  }
                  type="checkbox"
                  value={p}
                  name="platforms"
                  onChange={(e) => handleSelect(e)}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={s.divlabelGenres}>
            <h2>
              <label>Genres:</label>
            </h2>
          </div>

          <div className={s.divGenres}>
            {genres?.map((g, i) => (
              <div className={s.divColumnaGeneros} key={i}>
                <input
                  disabled={
                    input.genres.length === 5 && !input.genres.includes(g.name) //deshabilita cuando es igual a 5 los generos elegidos
                  }
                  type="checkbox"
                  value={g.name}
                  name="genres"
                  onChange={(e) => handleSelect(e)}
                />
                <label htmlFor={g.name}>{g.name}</label>
              </div>
            ))}
          </div>
        </div>

        <button className={s.btnFormCreate} type="submit">
          Create!
        </button>

        <div>
          <Link to="/home">
            <button className={s.btnForm}>Back</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
