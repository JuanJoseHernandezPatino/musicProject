let path = require("path")
let mongo = require("./mongo")
let conexion = require("./conexionbd")
let sql = require("mssql")

function pantallaEventos(req, res) {

    res.sendFile(path.join(__dirname, "./../views/eventos.html"))
    // if (req.session.nombre) {
    //     res.sendFile(path.join(__dirname, "./../views/eventos.html"))
    // } else {
    //     res.sendFile(path.join(__dirname, "./../views/index.html"));
    // }
}

module.exports = {
    pantallaEventos: pantallaEventos
}