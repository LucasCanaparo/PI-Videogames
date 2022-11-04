import axios from "axios";
export const APPLY_FILTERS = "APPLY_FILTERS" 
export const SET_PAGE = "SET_PAGE" 
//lugar donde se conecta el back con mi front

//trae los games desde mi back
export function getVideogames() {
  return async function (dispatch) {
    dispatch(loading())
    try {
      var json = await axios.get("http://localhost:3001/videogames"); //hago un get del los juego a mi localhost (o sea mi BBDD)
    return dispatch({ //retorno el type y la carga util
      type: "GET_VIDEOGAMES",
      payload: json.data,
    });
    } catch (error) {
      console.log(error + " error del getVideogames");
      return dispatch({ //sino devuelvo un error, el type y un array vacio -> para que no crashe la pagina
        type: "GET_VIDEOGAMES",
        payload: [],
      });
    }
  };
}

//ruta de las platforms
export function getPlatforms() {
  return async function (dispatch) {
    try {
      var json = await axios.get("http://localhost:3001/platforms"); //hace el pedido a mi BBDD (localhost)
      return dispatch({ //retorna el type y la carga util
      type: "GET_PLATFORMS",
      payload: json.data, 
    });
    } catch (error) {
      console.log(error + 'error del getPlatforms')
    }
  };
}

export function getDetail(id) { //recibe un id -> con el que va a hacer la busqueda
  return async function (dispatch) {
    try {
      var json = await axios.get(`http://localhost:3001/videogames/${id}`); //busca (con el id) el juego requeridoen la BBDD
      return dispatch({ //retorna la info
        type: "GET_DETAIL",
        payload: json.data,
      });
    } catch (error) {
      console.log(error + " error del getDetail");
    }
  };
}

export function getGenres() { //trae los generos de mi BBDD
  return async function (dispatch) {
    try {
      var genre = await axios.get("http://localhost:3001/genres");
      return dispatch({ //retorna la info 
        type: "GET_GENRES",
        payload: genre.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

//action del POST
export function postVideogame(payload) { //recibe la carga -> la info del formulario
  return async function (dispatch) {
    try {
      //hace un post usando la ruta y la carga pasado por parametro
      await axios.post("http://localhost:3001/videogames", payload); //axios.post
      return true;
    } catch (error) {
      return false
    }
  };
}

//filtrado por ascendente y descendente -> sort
export function orderByName(payload) { //recibe la carga 'payload' y la devuelve 
  return {
    type: "ORDER_BY_NAME",
    payload, //seria el tipo de ordenamiento (asc o desc // highRating o LowRating) -> sirve para los dos
  };
}

export function filterByCreated(payload) { //recibe la carga 'payload' y la devuelve 
  return {
    type: "FILTER_CREATED",
    payload, //seria el tipo de filtro (creado en la BBDD (form) o traido de la API) -> se usa en applyfilters
  };
}

export function getNameVideogame(name) { //recibe un name por paramtro -> para hacer la busqueda
  return async function (dispatch) {
    dispatch(loading()) //lo mismo que getvideogame (paginado) pero para la busqueda de un juego por searchbar
    try {
      var json = await axios.get( //busca por name el juego en mi BBDD
        `http://localhost:3001/videogames?name=${name}`
      );
      return dispatch({ //y lo retorna con su info
        type: "GET_NAME_VIDEOGAME",
        payload: json.data,
      });
    } catch (error) {
      console.log(error + " error del getNameVideogame");
      return dispatch({ //y sino retorn un array vacio -> para que no crashe
        type: "GET_NAME_VIDEOGAME",
        payload: [],
        //ademas aqui (en el front) se ejecuta el componente NotFound
      });
    }
  };
}

export function filterByGenre(payload) { //recibe la carga util
  return {
    type: "FILTER_BY_GENRE",
    payload, //seria el tipo de genero a filtrar
  };
}

export function clearDetail() { //limpia el detail
  return {
    type: "CLEAR_DETAIL",
    payload: [], //pas un array vacio par que cuando se haga el dispatch nuevo no se pise con el anterior
  };
}

export function loading() { //esta funcion sirve para evitar que los juegos siempre esten cargandose -> se usa en el Home
  return {
    type: "LOADING",
  };
}

export function applyFilters() { //funcion general pra los filtros -> utiliza varios estados
  return {
    type: APPLY_FILTERS,
  }
}

export function setCurrentPage(page) { //recibe la pagina actual (la que selecciono) como carga
  return {
    type: "SET_PAGE",
    payload: page, //y la retorna al reducer para cambiar el estado
  };
}
