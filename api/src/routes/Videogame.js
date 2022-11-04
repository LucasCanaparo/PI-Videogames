const { Router } = require("express");
const { allInfo, getById } = require("../controllers/controllers");
const { Videogame, Genres } = require("../db");
const router = Router();

//lo que me tra el allInfo:
//    id: 864,
//    name: 'Dishonored 2',
//    image: 'https://media.rawg.io/media/games/f6b/f6bed028b02369d4cab548f4f9337e81.jpg',
//    description: undefined,
//    platforms: [ 'Xbox One', 'PC', 'PlayStation 4' ],
//    released: '2016-11-10',
//    rating: 4.26,
//    genres: [ 'Action', 'RPG' ]
//  }

//ejemplo -> http://localhost:3001/videogames
//ruta del videogames
router.get("/", async (req, res) => {
  const { name } = req.query; //busca lo que coincide con el name -> search query

  try {
    const allGames = await allInfo(name); //allGames -> es TODOS los juegos (API y BBDD)
    //reviso si no existe y traigo todos los juegos
    //allGames es un array de objetos

    return allGames
      ? res.status(200).send(allGames) //si existe (allGames) lo retorno
      : res.status(404).send("No existe el juego buscado"); //sino, doy el mensaje de que no existe
  } catch (error) {
    console.log(error + "error del get /videogames");
  }
});

//ruta del id
router.get("/:id", async (req, res) => {
  const { id } = req.params; //busco por params -> en la barra de busqueda (arriba)
  try {
    return res.send(await getById(id)); //envia la info (id recibida) a la funcion getById -> y compara si la info es de la BBDD o de la API -> y la devuelve
  } catch (error) {
    console.log(error + "error del get /videogames/id");
  }
});

//ruta del post
router.post("/", async (req, res) => {
  const { //esta es la info que recibe por body -> lo que viene del formulario
    name,
    description_raw,
    released,
    rating,
    background_image,
    platforms,
    createdInDb,
    genres,
  } = req.body; 
  if (!name || !description_raw || !platforms) {
    return res.send(404).send({ message: "Faltan datos obligatorios" }); //hace un pequeño filtro
  }

  try {
    
    let newGame = await Videogame.create({ //crea (con el .create) el nuevo juego y lo guarda en una variable
      name,
      description_raw,
      released,
      rating,
      background_image,
      platforms,
      createdInDb, //con su identificador de BBDD
    });
    console.log(newGame)

    let genresDb = await Genres.findAll({ //recupera la info de la tabla genres y la guarda en una variable para buscar por name lo que coincide
      where: {
        name: genres, //donde el name coincida con el genres pasado por body
      },
    });
    await newGame.addGenre(genresDb); //agrega al juego creado el genero
    res.status(200).send("Juego creado correctamente"); //devuelve un mensaje
  } catch (error) {
    console.log(error);
    res.status(404).send(error + "error del /Post");
  }
});

module.exports = router;