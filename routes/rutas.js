const express = require("express");
const rutas = express.Router();
const path = require("path");

rutas.get("/", (req, res) => {
    console.log(req.session); // Acceder a la variable de sesión
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

module.exports = rutas;
