const express = require("express");
const rutas = express.Router();
const path = require("path");
let funciones = require("../controllers/controlInicio")

rutas.get("/", (req, res) => {
    console.log(req.session); // Acceder a la variable de sesión
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

rutas.post("/cargarRegistro", funciones.guardarRegistro)

rutas.post("/loguearse", funciones.logueo)



module.exports = rutas;
