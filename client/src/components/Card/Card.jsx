import React from "react";
import s from "./Card.module.css";

export default function Card({ //pide por parametro todos esos valores -> se renderiza en el Home
  name,
  background_image,
  rating,
  genres,
}) {
  return ( // y los retorna 
    <div className={s.divDetail}>
      <h3 className={s.hTituloDetail}>{name}</h3>
      <img
      className={s.imgDetail}
        src={background_image}
        alt="Img not found"
        width="300px"
        height="200px"
      />
      <h4 className={s.hDetail}>{rating}</h4>
      <h3 className={s.hDetail}>{genres}</h3>
    </div>
  );
}
