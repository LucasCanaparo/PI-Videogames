const { Router } = require("express");
const { Genres } = require("../db");

const router = Router();

//trae todos los generos
//ejemplo -> http://localhost:3001/genres (get)
router.get("/", async (req, res) => {
  try {
    const allGenres = await Genres.findAll(); //findAll() recupera toda la info de la tabla Genres (BBDD) -> devuelve un array
    res.send(allGenres); //devuelve (hace un .send) de los generos
  } catch (error) {
    console.log(error + " error del get /genres"); 
    res.status(404).send({ error: error.message }); //sino devuelve un 404
  }
});

module.exports = router;
