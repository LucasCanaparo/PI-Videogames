import React from "react";
import s from './NotFound.module.css'

//funcion que uso cuando no tengo anda que mostrar
export default function NotFound() {
  return (
    <div className={s.divNotFound}>
      <h1 className={s.h1NotFound}>Videogame not found...</h1>
      <img
        id="img_not_found"
        src="https://j.gifs.com/q7Doj7.gif"
        alt="Videogame not found..."
      />
    </div>
  );
}
