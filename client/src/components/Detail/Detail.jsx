/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDetail, clearDetail } from "../../Redux/Actions";
import s from "./Detail.module.css";
import NotFound from "../NotFound";

export default function Detail(props) { 
  const dispatch = useDispatch();
  const { id } = useParams(); //trae el id por params 
  //el useParams me permite acceder desde un componente a los parametros de la ruta
  //o sea, me trae la info (id) desde la ruta al getDetail para usarlo
  //esto es un array

  useEffect(() => { //se ejecuta al modificar sus dependencias (en este caso)
    //accede al id del detail y despacha la funcion con el id que recibe
    dispatch(getDetail(id));
    //cada vez que renderiza el componente limpia el estado para que no se vea al ejecutar el sig detail
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]); //esto sirve para que el useEffect se ejecute cuando se modifican sus dependencias

  const myVideogame = useSelector((state) => state.detail); //nos permite extraer datos del store de Redux utilizando una función selectora
  //traigo el estado detail y me lo guardo en una const
  //console.log(myVideogame);

  //renderizar
  return (
    <div className={s.divFondoDetail}>
      {myVideogame.name ? ( //si existe un name es porque hay un game -> entonces no me tirar error
        <div>
          <h1 className={s.h1Detail}>{myVideogame.name}</h1>
          <img
            className={s.imgDetail}
            src={
              myVideogame.image
                ? myVideogame.image
                : myVideogame.background_image
            }
            alt=""
            width="500px"
            height="300px"
          />
          <h3 className={s.h3Detail}>Rating: {myVideogame.rating}</h3>
          <p className={s.pDetail}>Released: {myVideogame.released}</p>
          <p className={s.pDetail}>Platforms: {myVideogame.platforms.join(", ")} </p>
          <p className={s.pDetail}>Genres: {myVideogame.genres.join(", ")}</p>
          <p className={s.descrDetail}> {myVideogame.description_raw}</p>
        </div>
      ) : (
        <div>
          <NotFound /> {/* si no hay nada me tira un mensaje de error */}
        </div>
      )}
      <Link to="/home"> {/* me redirige a /home */}
        <button className={s.btnDetail}>Back</button>
      </Link>
    </div>
  );
}
