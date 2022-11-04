import React from "react";
import s from './Loading.module.css'

//funcion que uso en la pantalla de carga
export default function Loading() {
  return (
    <div className={s.divLoading}>
      <img
        id="img_loading"
        src="https://thumbs.gfycat.com/DeliriousLeadingAmericanwirehair-size_restricted.gif"
        alt="Loading..."
      />
      <h1 className={s.h1Loading}>Loading...</h1>
    </div>
  );
}
