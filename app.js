const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");




app.listen(port, () => {
    console.log("listen in port: " + port)
})