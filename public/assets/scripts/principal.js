window.addEventListener("load", () => {
    let consulta = new XMLHttpRequest();
    consulta.open("GET", "/menu", true);
    consulta.setRequestHeader("Content-Type", "text/html");
    consulta.onload = () => {
        if (consulta.status === 200) {
            let menu = consulta.responseText;
            document.getElementById("menu").innerHTML = menu;
        }
    };
    consulta.send();
})

function imprimirUsuario() {
    let peticion = new XMLHttpRequest();
    peticion.open("get", "/traerUsuario");
    peticion.setRequestHeader("content-type", "application/json")
    peticion.onload = () => {
        if (peticion.status == 200) {
            let peticionRespuesta = JSON.parse(peticion.responseText);
            console.log(peticionRespuesta)
        }
    }
    peticion.send()
}