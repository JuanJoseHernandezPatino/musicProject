const { Int } = require("mssql");
const conexion = require("./conexionbd")
const sql = require("mssql")

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
            .input('maestro', sql.VarChar, sltMaestro)
            .input('municipio', sql.VarChar, txtMunicipioRegistro)
            .query(`
          INSERT INTO usuarios (id, nombre, apellidos, correo, contrasena, maestro, municipio)
          VALUES (
            @id,
            @nombres,
            @apellidos,
            @correo,
            @password,
            @maestro,
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


module.exports = {
    guardarRegistro: guardarRegistro
}

/*


*/