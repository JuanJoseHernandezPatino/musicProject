const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
let path = require("path");
let rutas = require("./routes/rutas")

const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("/", rutas)

app.use(
  session({
    secret: "this_is_mi_secret_key",
    resave: false,
    saveUninitialized: false
  })
);


app.listen(port, () => {
  console.log("Listening on port: " + port);
});
