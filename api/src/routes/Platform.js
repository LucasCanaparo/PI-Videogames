const { Router } = require("express");
const { Platforms } = require("../db");
const router = Router();

//trae todos las plataformas
//hace lo mismo que el get de la ruta genre
//ejemplo -> http://localhost:3001/platforms (get)
router.get("/", async (req, res) => {
  try {
    const allPlatforms = await Platforms.findAll();//findAll() recupera toda la info de la tabla Platforms (BBDD) -> devuelve un array
    const platformJson = allPlatforms.map((p) => p.toJSON()) //.toJSON() convierte la info a formato JSON -> asi luego puedo mapearlo y traer el name de las platforms
    res.send(platformJson.map((p) => p.name)); //mape y traigo por name
  } catch (error) {
    console.log(error + " error del get /platforms");
    res.status(404).send({ error: error.message }); //sino devuelvo el 404
  }
});

module.exports = router;
