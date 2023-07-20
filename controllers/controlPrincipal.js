let path = require("path")

function enviarMenu(req, res) {
    let rol = req.session.rol;
    if (rol == "admin" || rol == "maestro") {
        res.sendFile(path.join(__dirname, "../views/menuAdmin.html"))
    } else {
        res.sendFile(path.join(__dirname, "../views/menuNormal.html"))
    }
}

function traerUsuario(req, res) {
    let usuario = req.session.nombre;
    let rol = req.session.rol;
    console.log(usuario, " ; ", rol)
    console.log(req.session)
    res.send({ nombre: usuario })
}

module.exports = {
    enviarMenu: enviarMenu,
    traerUsuario: traerUsuario
}