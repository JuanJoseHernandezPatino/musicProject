const express = require("express");
const rutas = express.Router();
const path = require("path");
let funciones = require("../controllers/controlInicio")

rutas.get("/", (req, res) => {
    console.log(req.session); // Acceder a la variable de sesión
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

rutas.post("/cargarRegistro", (req, res) => {
    funciones.guardarRegistro(req, res)
})

module.exports = rutas;
