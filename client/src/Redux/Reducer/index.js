import { APPLY_FILTERS, SET_PAGE } from "../Actions";

const initialState = {
  videogames: [],
  //este estado SIEMPRE tiene todos los games -> se usa de base para resetear el filtro
  allGames: [],
  detail: {},
  genres: [],
  platforms: [],
  filterGenre: "",
  sortFilter: "",
  filterCreated: "",
  loading: false,
  page: 1
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    //manda todo lo que te da el 'get_videogames'
    case "GET_VIDEOGAMES":
      return { //carga los juegos del back en el estado del reducer
        ...state, //sobreescribe el estado
        videogames: action.payload, // y guarda la info en cada uno
        allGames: action.payload,
        loading: false //cambia el loading a false -> para indicar (en el Home) que los juegos ya esta cargados (paginado)
      };

    case 'GET_PLATFORMS' :
      return { //retorna el estado con sus plataforms
        ...state,
        platforms: action.payload
      }

    case "GET_DETAIL":
      return { //retorna el estado guardando la info del juego en el estado Detail
        ...state,
        detail: action.payload,
      };

    //POST
    case "POST_ACTIVITY":
      return {
        ...state,
      };

    case "ORDER_BY_NAME":
      return { //guarda en mi estado sortFilter la info de ordenamiento (asc o desc // highRating o LowRating) -> eso va para el applyfilters
        ...state,
        sortFilter: action.payload,
      };

    case "FILTER_CREATED":
      return {
        ...state,
       filterCreated: action.payload //guarda en mi estado filterCreated la info de ordenamiento (creado o por API) -> eso va para el applyfilters
      };

      case APPLY_FILTERS:
        //filtro por tipo de juego -> creado o por API
        const createdFilter =
          state.filterCreated === "created" //este es el valor (value) de mi filtro en el Home
            ? state.allGames.filter((e) => e.createInDb) //devuelve todos los que tengan la propiedad createInDb
            : state.filterCreated === "api"
            ? state.allGames.filter((e) => !e.createInDb) //sino (si es api) devuelve los que no tiene esa propiedad
            : [...state.allGames]; //y sino devuelve todos -> value="" -> AllGenres
        const filterByGenre = state.filterGenre //mi estado con los values de mi filtro -> si tengo el estado...
          ? createdFilter.filter((e) => e.genres.includes(state.filterGenre)) //filtro los generos donde este includo el tipo de genero que seleccione en mi filtro
          : createdFilter; //si no devuelo todos los generos (juegos)
        const sorted = //aqui filtro por rating y alfabetico
          state.sortFilter === "HighRating"
            ? filterByGenre.sort(function (a, b) {//averiguo si existe ese rating en los generos que tengo
                if (a.rating > b.rating) {
                  return -1;
                }
                if (b.rating > a.rating) {
                  return 1;
                }
                return 0;
              })
            : state.sortFilter === "LowRating"
            ? filterByGenre.sort(function (a, b) {
                if (a.rating > b.rating) {
                  return 1;
                }
                if (b.rating > a.rating) {
                  return -1;
                }
                return 0;
              })
            : state.sortFilter === "asc"
            ? filterByGenre.sort(function (a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return 1;
                }
                if (b.name.toLowerCase() > a.name.toLowerCase()) {
                  return -1;
                }
                return 0;
              })
            : state.sortFilter === "desc"
            ? filterByGenre.sort(function (a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return -1;
                }
                if (b.name.toLowerCase() > a.name.toLowerCase()) {
                  return 1;
                }
                return 0;
              })
            : filterByGenre; //sino devuelve todo sin ordenar -> value=""  
        return { 
          ...state, 
          videogames: [...sorted] //retorna el estado videogames con el cambio del sorted
        };

    case SET_PAGE:
      return {
        ...state,
        page: action.payload, //recibe la info (la pagina que ver) y la cambia en el estado page para renderizarla en el Home
    };


    //buscar videogames por searchbar
    case "GET_NAME_VIDEOGAME":
      return {
        ...state,
        //compruebo si en la busqueda de la searchbar existe lo que puso de input
        videogames: action.payload.err
          ? [{ Error: "No existe el juego" }] //si no exiiste tiro error
          : action.payload, //y si existre lo devuelvo
        allGames: action.payload, //guardo la info en mi estado -> que luego renderizo
        loading: false //cambia el loading a false -> para indicar (en el Home) que los juegos ya esta cargados (paginado)
      };

    case "CLEAR_DETAIL":
      return {
        ...state,
        detail: {}, //retorn un detail vacio
      };

    case "FILTER_BY_GENRE":
      return {
        ...state,
        filterGenre: action.payload, //guarda en filterGenre el tipo de genero a filtrar -> y luego a renderizar
      };

    case "GET_GENRES":
      return { //guarda la info de genres en mi estado genres y me la retorna
        ...state,
        genres: action.payload,
      };

    case 'LOADING' : 
    return {
      ...state,
      loading: true //cambia el estado a true para que en el Home no vuelva a renderizar el paginado
    }

    default:
      return state;
  }
}

export default rootReducer;
