const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.get("/", (req, res) => {
    res.sendFile(__dirname + ("/view/index.html"))
})


app.listen(port, () => {
    console.log("listen in port: " + port)
})