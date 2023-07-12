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
        const pool = await sql.connect(confi);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

module.exports.getConexion = getConexion;