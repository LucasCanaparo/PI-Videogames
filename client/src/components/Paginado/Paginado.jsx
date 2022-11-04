/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import s from './Paginado.module.css'

export default function Paginado({ videogamesPerPage, allGames, paginado }) {
  const pageNumbers = []; //esta es la const que va a usar en el Home para renderizar el numero de pagina

  for (let i = 1; i <= Math.ceil(allGames / videogamesPerPage); i++) {
    //divide los juegos entre la cantidad maxima por pagina -> 15 -> se indica en el Home
    pageNumbers.push(i); //pushea la cantidad de veces que i se repite y esa es la cantidad de paginas
  }

  return (
    <nav className={s.navPaginacion}>
      <ul className={s.pagination}>
        {pageNumbers &&
          pageNumbers.map((number) => ( //hace una lista mapeando al const pageNumbers
            <li key={number}> 
              <a onClick={() => paginado(number)}>{number}</a> {/* por cada mapeo crea un 'boton' (<a>) con un numero de pagina */}
            </li>
          ))}
      </ul>
    </nav>
  );
}
