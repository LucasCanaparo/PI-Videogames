const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogames = require("./Videogame");
const genres = require("./Genre");
const platforms = require("./Platform");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
//aqui modularizas las rutas
router.use("/videogames", videogames);
router.use("/genres", genres);
router.use("/platforms", platforms);

module.exports = router;
