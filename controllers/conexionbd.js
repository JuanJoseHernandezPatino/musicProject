const sql = require('mssql')

async function getConexion() {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('Server=(localdb)\\calipsoServer,1433;Database=musicProject;User Id=calipsoLogin;Password=juanjo2023...;Encrypt=true')

            ('Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true')

        const result = await sql.query`select * from Usuarios`
        console.dir(result)
    } catch (err) {
        console.log(err)
    }
}

getConexion()