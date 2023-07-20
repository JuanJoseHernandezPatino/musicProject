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
        let { nombreInstrumento, serialInstrumento, observacionInstrumento, marcaInstrumento } = req.body;
        let id = generarID();
        const fechaActual = obtenerFechaActual();
        let municipio = req.session.municipio;
        //#region guardarSQL
        let pool = await conexion.getConexion()
        let result = await pool.request()
            .input("nombreInstrumento", sql.VarChar, nombreInstrumento)
            .input("serialInstrumento", sql.VarChar, serialInstrumento)
            .input("marcaInstrumento", sql.VarChar, marcaInstrumento)
            .input("municipioInstrumento", sql.VarChar, municipio)
            .query(`INSERT INTO instrumental (nombreInstrumento,serialInstrumento,marcaInstrumento,municipioInstrumento) values(@nombreInstrumento,@serialInstrumento,@marcaInstrumento,@municipioInstrumento)`)
        //#endregion
        if (typeof result == 'undefined') {
            res.send({ error: "errorFatal" })
            console.log("errorFatal")
            return;
        }
        //#region guardarMongo
        const nuevoInstrumento = {
            _id: id,
            nombre: nombreInstrumento,
            serial: serialInstrumento,
            marca: marcaInstrumento,
            observacion: observacionInstrumento,
            fecha: fechaActual,
            estadoInstrumento: "Activo",
            municipio: municipio
        };
        const instrumentoCollection = mongo.db.collection('instrumentos');

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
        let municipio = req.session.municipio;
        let pool = await conexion.getConexion();
        let result = await pool.request().query(`SELECT * FROM instrumental WHERE municipioInstrumento = '${municipio}'`);
        let respuesta = result.recordset;
        res.json(respuesta)
    } catch (error) {
        res.send({ respuesta: "errorFatal" })
    }
}

async function eliminarInstrumento(req, res) {
    try {
        let { id } = req.body;
        let pool = await conexion.getConexion();
        let result = await pool.request().query(`DELETE FROM instrumental WHERE serialInstrumento = '${id}'`)
        if (result) {
            const instrumentoCollection = mongo.db.collection('instrumentos');

            instrumentoCollection.updateOne(
                { serial: id },
                { $set: { estadoInstrumento: "Inactivo" } }
            )
                .then(() => {
                    res.send({ respuesta: "eliminado" })
                })
                .catch((error) => {
                    console.log(error)
                    res.send({ respuesta: "fatalError" })
                });

        }
        else {
            res.send({ respuesta: "fatalError" })
        }
    } catch (error) {
        res.send({ respuesta: "fatalError" })
    }

}

async function verObservaciones(req, res) {
    let municipio = req.session.municipio;
    let { id } = req.body;

    const instrumentoCollection = mongo.db.collection('instrumentos');

    instrumentoCollection.find({ serial: id, municipio: municipio }).toArray()
        .then((resultados) => {
            res.send(resultados)
        })
        .catch((error) => {
            console.log(error)
            res.send({ respuesta: "fatalError" })
        });
}

async function instrumento(req, res) {
    try {
        let { id } = req.body;

        let pool = await conexion.getConexion();
        let result = await pool.request().query(`SELECT * FROM instrumental WHERE serialInstrumento = '${id}'`)
        let datos = result.recordset[0];
        res.send(datos)
    } catch (error) {
        res.send({ respuesta: "errorFatal" })
    }
}

async function guardarObservacion(req, res) {
    let { marcaInstrumentoObservacion,
        nombreInstrumentoObservacion,
        nuevaObservacion,
        serialInstrumentoObservacion } = req.body;

    let id = generarID();
    const fechaActual = obtenerFechaActual();

    const nuevoInstrumento = {
        _id: id,
        nombre: nombreInstrumentoObservacion,
        serial: serialInstrumentoObservacion,
        marca: marcaInstrumentoObservacion,
        observacion: nuevaObservacion,
        fecha: fechaActual,
        estadoInstrumento: "Activo"
    };
    const instrumentoCollection = mongo.db.collection('instrumentos');

    instrumentoCollection.insertOne(nuevoInstrumento)
        .then(() => {
            console.log('Inserción exitosa');
            res.send({ respuesta: 'guardado' });
        })
        .catch((error) => {
            console.error('Error al insertar:', error);
            res.status(500).send({ respuesta: 'errorFatal' });
        });
}

async function actualizarObservacion(req, res) {

    let { id, observacion, serial } = req.body;

    const instrumentoCollection = mongo.db.collection('instrumentos');

    instrumentoCollection.updateOne({ _id: id }, { $set: { observacion: observacion } })
        .then(() => {
            instrumentoCollection.find({ serial: serial }).toArray()
                .then((resultados) => {
                    console.log(resultados)
                    res.send(resultados)
                })
                .catch((error) => {
                    console.log(error)
                    res.send({ respuesta: "fatalError" })
                });
        })
        .catch((error) => {
            console.error('Error al actualizar:', error);
            res.status(500).send({ respuesta: 'errorFatal' });
        });

}

async function eliminarObservacion(req, res) {
    let { id, serial } = req.body
    const instrumentoCollection = mongo.db.collection('instrumentos');

    instrumentoCollection.deleteMany({ _id: id })
        .then(() => {
            instrumentoCollection.find({ serial: serial }).toArray()
                .then((datos) => {
                    console.log(datos)
                    let respuesta = { respuesta: "exito", datos: datos };
                    res.send(respuesta)
                })
                .catch((error) => {
                    console.log(error)
                    res.send({ respuesta: "fatalError" })
                });
        })
        .catch((error) => {
            console.error('Error al actualizar:', error);
            res.status(500).send({ respuesta: 'errorFatal' });
        });
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
    datosInstrumentos: datosInstrumentos,
    eliminarInstrumento: eliminarInstrumento,
    verObservaciones: verObservaciones,
    instrumento: instrumento,
    guardarObservacion: guardarObservacion,
    actualizarObservacion: actualizarObservacion,
    eliminarObservacion: eliminarObservacion
}