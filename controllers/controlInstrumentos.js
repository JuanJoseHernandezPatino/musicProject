let path = require("path")
let mongo = require("./mongo")
let conexion = require("./conexionbd")
let sql = require("mssql")

function pantalla(req, res) {
    if (req.session.nombre) {
        res.sendFile(path.join(__dirname, "./../views/instrumentos.html"))
    } else {
        res.sendFile(path.join(__dirname, "./../views/index.html"));
    }
}

async function guardarInstrumento(req, res) {
    try {
        let { nombreInstrumento, serialInstrumento, observacionInstrumento } = req.body;
        let id = generarID();
        const fechaActual = obtenerFechaActual();
        //#region guardarSQL
        let pool = await conexion.getConexion()
        let result = await pool.request()
            .input("nombreInstrumento", sql.VarChar, nombreInstrumento)
            .input("serialInstrumento", sql.VarChar, serialInstrumento)
            .query(`INSERT INTO instrumental (nombreInstrumento,serialInstrumento) values(@nombreInstrumento,@serialInstrumento)`)
        //#endregion
        if (typeof result == 'undefined') {
            res.send({ error: "errorFatal" })
            console.log("errorFatal")
            return;
        }
        //#region guardarMongo
        const instrumentoCollection = mongo.db.collection('instrumentos');
        const nuevoInstrumento = {
            _id: id,
            nombre: nombreInstrumento,
            serial: serialInstrumento,
            observacion: observacionInstrumento,
            fecha: fechaActual
        };

        instrumentoCollection.insertOne(nuevoInstrumento)
            .then(() => {
                console.log('Inserción exitosa');
                res.send({ respuesta: 'Inserción exitosa' });
            })
            .catch((error) => {
                console.error('Error al insertar:', error);
                res.status(500).send({ respuesta: 'Error al insertar' });
            });
        //#endregion
    } catch (error) {

    }
}

async function datosInstrumentos(req, res) {
    try {
        let pool = await conexion.getConexion();
        let result = await pool.request().query(`SELECT * FROM instrumental`);
        let respuesta = result.recordset;
        res.json(respuesta)
    } catch (error) {
        res.send({ respuesta: "errorFatal" })
    }
}

//#region datosGenerados
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

function obtenerFechaActual() {
    const fecha = new Date();

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo tanto, se suma 1
    const anio = fecha.getFullYear();

    // Asegura que el día y el mes tengan dos dígitos
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;

    // Crea la cadena con el formato "dd/mm/aaaa"
    const fechaActual = `${diaFormateado}/${mesFormateado}/${anio}`;

    return fechaActual;
}
//#endregion

module.exports = {
    pantalla: pantalla,
    guardarInstrumento: guardarInstrumento,
    datosInstrumentos: datosInstrumentos
}