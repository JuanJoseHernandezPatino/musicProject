const express = require("express");
const rutas = express.Router();
const path = require("path");
let principal = require("../controllers/controlPrincipal")
let instrumentos = require("../controllers/controlInstrumentos")
let funciones = require("../controllers/controlInicio")
let eventos = require("../controllers/controlEventos")


//#region inicioSesion
rutas.get("/", (req, res) => {
    console.log(req.session); // Acceder a la variable de sesión
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

rutas.post("/cargarRegistro", funciones.guardarRegistro)

rutas.post("/loguearse", funciones.logueo)

rutas.get("/principal", funciones.cargarPrincipal)
//#endregion

//#region principal
rutas.get("/menu", principal.enviarMenu)

rutas.get("/traerUsuario", principal.traerUsuario)

//#endregion

//#region instrumental
rutas.get("/instrumentos", instrumentos.pantalla)

rutas.get("/datosInstrumentos", instrumentos.datosInstrumentos)

rutas.post("/guardarInstrumento", instrumentos.guardarInstrumento)

rutas.post("/eliminarInstrumento", instrumentos.eliminarInstrumento)

rutas.post("/datosObservacionesInstrumentos", instrumentos.verObservaciones)

rutas.post("/datosInstrumento", instrumentos.instrumento)

rutas.post("/guardarObservacion", instrumentos.guardarObservacion)

rutas.post("/guardarActualizacionObservacion", instrumentos.actualizarObservacion)

rutas.post("/eliminarObservacion", instrumentos.eliminarObservacion)

//#endregion

//#region eventos
rutas.get("/enventos", eventos.pantallaEventos)

//#endregion
module.exports = rutas;
