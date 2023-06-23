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
    //'Server=,1433;Database=musicProject;User Id=sa;Password=juanjo2023...;Encrypt=true'
}

async function getConexion() {
    try {
        let pool = await sql.connect(confi);
        return pool;
    } catch (err) {
        console.log(err)
    }
}

getConexion()