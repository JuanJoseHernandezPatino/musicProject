window.addEventListener("load", async () => {
    let menu = new XMLHttpRequest();
    menu.open("get", "/menu", true);
    menu.setRequestHeader("content-type", "text/html");
    menu.onload = () => {
        if (menu.status == 200) {
            let R = menu.responseText;
            document.getElementById("menu").innerHTML = R;
        }
    }
    menu.send()

    solicitarDatosInstrumentos()
})

function solicitarDatosInstrumentos() {
    let tabla = new XMLHttpRequest();
    tabla.open("get", "/datosInstrumentos");
    tabla.setRequestHeader("content-type", "application/json");
    tabla.onload = () => {
        if (tabla.status == 200) {
            let datos = JSON.parse(tabla.response);
            dibujarTabla(datos)
            console.log(datos)
        }
    }
    tabla.send()
}

function dibujarTabla(datos) {
    let tabla = document.getElementById("tablaInstrumentos")
    datos.forEach(element => {
        let tr = document.createElement("tr");
        let tdSerial = document.createElement("td");
        let tdNombre = document.createElement("td");
        let tdAcciones = document.createElement("td");
        let btnObservar = document.createElement("button");
        let btnEliminar = document.createElement("button");
        let btnAgregarObservacion = document.createElement("button")
        let div = document.createElement("div")


        btnAgregarObservacion.textContent = "Agregar observacion";
        btnEliminar.textContent = "Eliminar";
        btnObservar.textContent = "Ver observaciones";

        div.setAttribute("class", "btn-group")

        btnAgregarObservacion.setAttribute("onclick", `AgregarObservacion(${element.serialInstrumento})`)
        btnEliminar.setAttribute("onclick", `Eliminar(${element.serialInstrumento})`)
        btnObservar.setAttribute("onclick", `Observar(${element.serialInstrumento})`)

        btnAgregarObservacion.setAttribute("class", "btn btn-outline-success")
        btnEliminar.setAttribute("class", "btn btn-outline-danger")
        btnObservar.setAttribute("class", "btn btn-outline-info")

        tdNombre.textContent = element.nombreInstrumento;
        tdSerial.textContent = element.serialInstrumento;

        div.appendChild(btnObservar)
        div.appendChild(btnAgregarObservacion)
        div.appendChild(btnEliminar)


        tdAcciones.appendChild(div)

        tr.appendChild(tdNombre)
        tr.appendChild(tdSerial)
        tr.appendChild(tdAcciones)
        tabla.appendChild(tr)
    });



}

//#region guardarInstrumento
function cancelarInstrumento() {
    document.getElementById("nombreInstrumento").value = "";
    document.getElementById("serialInstrumento").value = "";
    document.getElementById("observacionInstrumento").value = "";
}

function guardarInstrumentos() {
    let nombreInstrumento = document.getElementById("nombreInstrumento").value;
    let serialInstrumento = document.getElementById("serialInstrumento").value;
    let observacionInstrumento = document.getElementById("observacionInstrumento").value;
    let datos = {
        nombreInstrumento: nombreInstrumento,
        serialInstrumento: serialInstrumento,
        observacionInstrumento: observacionInstrumento
    }

    let peticion = new XMLHttpRequest();
    peticion.open("post", "/guardarInstrumento");
    peticion.setRequestHeader("Content-Type", "application/json");
    peticion.onload = () => {
        if (peticion.status == 200) {
            let res = JSON.parse(peticion.responseText);
            if (res.respuesta == "Inserción exitosa") {
                document.getElementById("btnCancelarRegistroInstrumento").click();
            }
        }
    }
    peticion.send(JSON.stringify(datos));


}
//#endregion




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