import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  filterByCreated,
  orderByName,
  getVideogames,
  filterByGenre,
  getGenres,
  setCurrentPage,
  applyFilters
} from "../Redux/Actions";
import Card from "../components/Card/Card";
import Paginado from "../components/Paginado/Paginado";
import SearchBar from "../components/SearchBar/SearchBar";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";

import s from './Home.module.css';

export default function Home() {
  //usa esta constante para despachar mis actions
  const dispatch = useDispatch(); //permite acceder a cualquier store pero esta vez para actualizar algo
  const {
    loading,
    videogames,
    filterGenre,
    sortFilter,
    genres,
    filterCreated,
    page: currentPage
  } = useSelector((state) => state) //me trae los estados de Redux 
  //useSelector me permite extraer datos del store de Redux

  //indica cuantos juegos tendre por pagina
  const [videogamesPerPage] = useState(15);
  const indexOfLastVideogame = currentPage * videogamesPerPage; //5 * 15 = 75 
  const indexOfFirsVideogame = indexOfLastVideogame - videogamesPerPage; //75 - 15 = 50
  const currentVideogames = videogames.slice( //devuelve una copia de una parte del array dentro de un nuevo array empezando por inicio hasta fin (fin no incluido) 
  //0 al 14 -> 15 al 29 y asi con cada pagina
    indexOfFirsVideogame,
    indexOfLastVideogame
  );

  //sirve para ayudar al renderizado de las paginas
  const paginado = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber)); //recibe la pagina (que seleccione) del Paginado (componente) y la envia a la action (por setCurrentPage) y desdpues cambia el reduce y su estado page
  };

  //traer del estado los games cuando el componente se monta -> useEffect
  useEffect(() => { //es una función que se ejecuta cuando el componente se modifica(dispatch del array) o desmonta
    if(!videogames.length) dispatch(getVideogames()); //si hay algo en el estado de videogames me despacha los juegos
    dispatch(getGenres()); //y los generos
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); //si detecta un cambio en el dispatch(o sea en las funciones y 
  //sus dependecias (estados)) ejecuta el useEffect -> SOLO ASI

  useEffect(() => {
    dispatch(applyFilters()); //despacha la funcion (que me cambia lo que veo en pantalla) cuando cambian sus dependecias -> cuando cambio/uso un filtro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filterCreated, filterGenre, sortFilter]); //dependencias que ejecutan el useEffect al alterarse

  function handleSort(e) {
    e.preventDefault();
    dispatch(orderByName(e.target.value)); //despacha la funcion orderByName con el tipo de ordenamiento buscado -> eso va a la action
    dispatch(setCurrentPage(1)) //setea la pagina en la 1
  }

  function handelFilterCreated(e) {
    dispatch(filterByCreated(e.target.value)); //despacha la funcion filterBycreated con el tipo de ordenamiento buscado -> eso va a la action
    dispatch(setCurrentPage(1))
  }

  function handleFilterGenres(e) {
    dispatch(filterByGenre(e.target.value)); //despacha la funcion filterByGenre con el tipo de ordenamiento buscado -> eso va a la action
    dispatch(setCurrentPage(1));
  }

  return (
    <div className={s.divFondoHome}>
      <div className={s.divTopHome}>
        <div className={s.divH1Home}>
          <h1 className={s.h1Home}>Videogame Page</h1>
        </div>

        <div className={s.divFormulario}> {/* esto te envia al form */}
          <Link className={s.linkForm} to="/videogames">Create a videogame</Link>
        </div>

        {/*Searchbar*/}
        <div className={s.divSearchbar}>
          <SearchBar setCurrentPage={setCurrentPage} /> {/* aqui reune la info (setCurrentPage) que le envia a la action para ser usada en la searchbar */}
        </div>

      

      <div className={s.divGridFiltros}>
      <div className={s.divFiltro}>
        {/*orden alfabético*/}

        <select value={sortFilter} onChange={(e) => handleSort(e)}>
          <option className={s.optionSelect} value="">
            No order
          </option>
          <option className={s.optionSelect} value="asc">A - Z</option>
          <option className={s.optionSelect} value="desc">Z - A</option>
          <option className={s.optionSelect} value="HighRating">High rating</option>
          <option className={s.optionSelect} value="LowRating">Low rating</option>
        </select>
      </div>

      <div className={s.divFiltro}> 
        {/*Creados por nosotros */}
        <select value={ filterCreated} onChange={(e) => handelFilterCreated(e)}>
          <option className={s.optionSelect} value="" >All games</option>
          <option className={s.optionSelect} value="created">Created</option>
          <option className={s.optionSelect} value="api">Games Api</option>
        </select>
      </div>   

        <div className={s.divFiltro}>
          <select value={filterGenre} onChange={(e) => handleFilterGenres(e)}>
            <option className={s.optionSelect} value="">All Genres</option>
            {genres?.map((genre) => {
              return (
                <option className={s.optionSelect} value={genre.name} key={genre.id}>
                  {genre.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      </div>

      {
        !loading ? <Paginado //si no hay loading -> esta en false -> carga los juegos
        videogamesPerPage={videogamesPerPage}
        allGames={videogames.length}
        paginado={paginado}
        currentPage={currentPage}
      /> : null //sino no carga nada
      //es para evitar que siempre que vuelva a Home me cargue los juegos
      }

        {/* si existe loading (esta en true) y no hay juegos (!videogames[0]) -> me muestra la pantalla de carga */}
      <div className={`${s.divVideojuegos} ${loading || !videogames[0] ? s.loading : ''}`}>
        {/* si existe loading (esta en true) me lo muestra (la pantalla de carga) -> significa que aun no se cargaron los juegos */}
        {/* sino me muestra los juegos y mapea la info de la card por cada juego (currentVideogame) */}
        {/* ademas tengo el Link que me redirige al Detail -> home/ + el id del juego*/}
        {loading ? <Loading/> : videogames[0] ? currentVideogames?.map((el) => (
                <Link key={el.id} className={s.LinkHome} to={"/home/" + el.id}>
                  <div className={s.divCard}>
                    <Card
                      key={el.id}
                      name={el.name}
                      background_image={el.background_image}
                      rating={el.rating}
                      genres={el.genres.join(" ")}
                    />
                  </div>
                </Link>
        )
      ) : <NotFound/>} 
      </div>

      {
        !loading ? <Paginado //si no hay loading -> esta en false -> carga los juegos
        videogamesPerPage={videogamesPerPage}
        allGames={videogames.length}
        paginado={paginado}
        currentPage={currentPage}
      /> : null //sino no carga nada
      //es para evitar que siempre que vuelva a Home me cargue los juegos
      }
    </div>
  );
}
