const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/musica', { useNewUrlParser: true })

mongoose.set('strictQuery', true);
//variable que guarda la conexión
const db = mongoose.connection;

//abre la conexión
db.once('open', () => {
    //console.log("conecto")
})

module.exports = {
    db: db
}