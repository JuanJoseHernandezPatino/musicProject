const sql = require('mssql')

let confi = {
    user: "calipso",
    password: "juanjo2023...",
    server: "localhost",
    database: "musicProject",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
}

async function getConexion() {
    try {
        let pool = await sql.connect(confi);
        return pool;
    } catch (err) {
        console.log(err)
    }
}

module.exports.getConexion = getConexion;