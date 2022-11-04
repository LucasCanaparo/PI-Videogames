import React from "react";
import { useState } from "react";
import { useDispatch} from "react-redux";
import {getNameVideogame } from "../../Redux/Actions";
import s from "./SearchBar.module.css";

export default function SearchBar({ setCurrentPage }) { //traigo por parametro la pagina corriente -> luego la voy a modificar
  const dispatch = useDispatch();
  const [name, setName] = useState(""); //creo un estado local name

  function handleInputChange(e) {
    e.preventDefault(); //cancela ejecucion del evento -> solo ejecuta el cambio
    setName(e.target.value); //modifico el estado para que tengo el value -> e.target.value
  }

  // function del button
  function handleSubmit(e) {
    e.preventDefault();
    if (name !== "") { //si name existe -> no es un str vacio
      dispatch(getNameVideogame(name)); //despacha el name (seria su payload) a la funcion getNameVideogame
      setName(""); //limpia el estado
      setCurrentPage(1); //setea la pagina en 1 -> todos los resultados ahora forman parte de la pagina numero 1
      //luego del dispatch de getNameVideogame se altera el estado videogame y el useEffect 
      //en el Home al detectar un cambio(del getVideogame) cambia lo que se renderiza 
      //en pantalla por la nueva info
    }
  }

  return (
    <div className={s.divSearchbar}>
      <div>
        <input className={s.inputSearchbar}
          type="text"
          placeholder="Search"
          value={name}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div>
        <button className={s.btnSearchbar} type="submit" onClick={(e) => handleSubmit(e)}>
          Search
        </button>
      </div>
    </div>
  );
}
