const { Int } = require("mssql");
const conexion = require("./conexionbd")
const sql = require("mssql")
let path = require("path");

async function guardarRegistro(req, res) {
    try {
        let datos = req.body;

        let txtNombresRegistro = datos.txtNombresRegistro;
        let txtApellidosRegistro = datos.txtApellidosRegistro;
        let txtCorreoRegistro = datos.txtCorreoRegistro;
        let txtContrasenaRegistro = datos.txtContrasenaRegistro;
        let sltMaestro = datos.sltMaestro;
        let txtMunicipioRegistro = datos.txtMunicipioRegistro;

        let id = generarID();

        let pool = await conexion.getConexion(); // Esperar a que se resuelva la promesa

        let result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .input('nombres', sql.VarChar, txtNombresRegistro)
            .input('apellidos', sql.VarChar, txtApellidosRegistro)
            .input('correo', sql.VarChar, txtCorreoRegistro)
            .input('password', sql.VarChar, txtContrasenaRegistro)
            .input('rol', sql.VarChar, sltMaestro)
            .input('municipio', sql.VarChar, txtMunicipioRegistro)
            .query(`
          INSERT INTO usuarios (id, nombre, apellidos, correo, contrasena, rol, municipio)
          VALUES (
            @id,
            @nombres,
            @apellidos,
            @correo,
            @password,
            @rol,
            @municipio
          )
        `);

        if (result) {
            res.send({ respuesta: "exito" })
        }
    } catch (error) {
        res.send({ respuesta: "error" })
    }
}

function generarID() {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    const id = `${anio}${mes}${dia}${hora}${minutos}${segundos}`;
    return id;
}

async function logueo(req, res) {
    try {
        let datos = req.body;
        let correo = datos.txtCorreologin
        let password = datos.passwordLogin;

        let pool = await conexion.getConexion(); // Esperar a que se resuelva la promesa
        //let result = await pool.request().query(`SELECT * FROM usuarios`);

        let result = await pool.request().query(`SELECT * FROM usuarios WHERE correo = '${correo}' and contrasena = '${password}'`);
        //let result = await pool.request().query(`SELECT * FROM usuarios WHERE correo = 'cali@gmail.com' and contrasena = 'juan'`);
        if (result.recordset) {
            let recordset = result.recordset[0];
            let nombreCompleto = recordset.nombre + " " + recordset.apellidos;
            req.session.nombre = nombreCompleto;
            req.session.rol = recordset.rol;
            //console.log(req.session)

            res.send({ respuesta: "loguear" })
        } else {
            res.send({ respuesta: "noExiste" })
        }

    } catch (error) {
        console.log(error);
    }
}

async function cargarPrincipal(req, res) {
    if (req.session.nombre) {
        res.sendFile(path.join(__dirname, "./../views/pagPrincipal.html"))
    } else {
        res.sendFile(path.join(__dirname, "./../views/index.html"));
    }
}

module.exports = {
    guardarRegistro: guardarRegistro,
    logueo: logueo,
    cargarPrincipal: cargarPrincipal
}
