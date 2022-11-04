require("dotenv").config();
const { API_KEY } = process.env;
const { Op } = require("sequelize");
const axios = require("axios");
const { Videogame, Genres, Platforms } = require("../db");

const videogamesController = {
  getApiVideogames: async function (name) { //trae los juegos de la api
    try {
      let games = [];
      let urlApi = name
        ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}` //me trae lo que coincide con el nombre
        : `https://api.rawg.io/api/games?key=${API_KEY}`; //sino me trae todo

      for (let i = 0; i < 5; i++) { //hace las consultas para traer los juegos -> trae 100
        const urlData = await axios.get(urlApi); //crea una const haciendo un await de la info
        const data = urlData.data.results.map(async (e) => { //pushea la info de los juegos en games
          games.push({
            id: e.id,
            name: e.name,
            background_image: e.background_image,
            description_raw: e.description_raw,
            platforms: e.platforms.map((e) => e.platform.name),
            released: e.released,
            rating: e.rating,
            genres: e.genres.map((e) => e.name),
          });
          const platforms = e.platforms.map(async (e) =>
            Platforms.findOrCreate({ where: { name: e.platform.name } }) 
          //findOrCreate es es un método de consulta que intenta encontrar una entrada en su tabla o crear una nueva entrada cuando no se encuentra nada
          );
          await Promise.all(platforms); //devuelve las plataformas solo cuando se cumplio el async del map -> Promise.all
        });
        await Promise.all(data);
        urlApi = urlData.data.next; //le indica a la API que debe dejar de buscar
      }
      return games; //retorna los juegos
    } catch (error) {
      //console.log(error + "error del getApiVideogames");
      return [] //si la api no trae nada devuelve un array vacio para que no tire error
    }
  },

  getDbInfo: async function (name) { //busco por nombre
    const gamesDb = name //si hay name me trae todo lo que coincide con name
      ? await Videogame.findAll({
          where: {
            //busca nombre que se parezcan -> Op.iLike
            //`%${name}%` -> busca en cualquier lugar del texto
            name: { [Op.iLike]: `%${name}%` },
            /*name: { name },*/
          },
          include: { //y sus generos
            model: Genres,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        })
      : await Videogame.findAll({ //y sino trae todo los juegos
          include: { //y sus generos
            model: Genres,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        });

    //carga los games en la DB para guardarlos
    const newGameDb = await gamesDb.map((e) => {
      return {
        id: e.id,
        name: e.name,
        background_image: e.background_image,
        description_raw: e.description_raw,
        platforms: e.platforms,
        released: e.released,
        rating: e.rating,
        createInDb: e.createInDb, //indicador que fue creado en la BBDD
        genres: e.Genres.map((e) => e.name),
      };
    });
    return newGameDb;
  },

  allInfo: async function (name) {
    const apiInfo = await videogamesController.getApiVideogames(name); //trae la info de la API luego de cargarse (por eso el await)
    const dbInfo = await videogamesController.getDbInfo(name); //trae la info de la BBDD luego de cargarse (por eso el await)
    const allInfo = dbInfo.concat(apiInfo); //concatena la info de la BBDD con la de la API
    return allInfo; //retorna toda la info BBDD y API concatenada
  },

  getById: async function (id) { //se usa en la ruta videogame para traer juegos por id 
    if (id.includes("-")) { //busco los id UUIV4 (creados por el formulario)
      const videogamejson = (
        await Videogame.findByPk(id, { include: Genres }) //trae el juego del modelo y su genero 
      ).toJSON();
      return { //retorna su info
        id: videogamejson.id,
        name: videogamejson.name,
        image: videogamejson.background_image,
        description_raw: videogamejson.description_raw,
        platforms: videogamejson.platforms,
        released: videogamejson.released,
        rating: videogamejson.rating,
        genres: videogamejson.Genres.map((g) => g.name),
      };
    } else {//si no coincide con el if busca el videojuego en la API
      const videogameApi = ( 
        await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
      ).data; //guarda el .data en la const videogameApi
      return { //retorna la info
        id: videogameApi.id, //el .data es para evitarlo meter aqui
        name: videogameApi.name,
        image: videogameApi.background_image,
        description_raw: videogameApi.description_raw,
        platforms: videogameApi.platforms.map((p) => p.platform.name),
        released: videogameApi.released,
        rating: videogameApi.rating,
        genres: videogameApi.genres.map((g) => g.name),
      };
    }
  },

  loadGenres: async function () {
    try {
      const urlGenres = await axios.get( //trae los generos de la API
        `https://api.rawg.io/api/genres?key=${API_KEY}`
      );
      //guarda los generos en la BBDD
      const genreEach = urlGenres.data.results.map(async (g) => { //mapea la info de la API
        Genres.findOrCreate({ //crea una tabla dentro del modelo Genres en la BBDD donde (name : g.name) el name coincida
          where: { name: g.name },
        });
      });
      await Promise.all(genreEach); //cuando se cumplen las promeas (el map) sigue a la siguiente linea
      return true; //el true es por el findOrCreate
    } catch (error) {
      console.log(error + " error del loadGenre");
      return false;
    }
  },
};

module.exports = videogamesController;
