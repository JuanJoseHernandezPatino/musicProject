
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
        }
    }
    tabla.send()
}

function dibujarTabla(datos) {
    let tabla = document.getElementById("tablaInstrumentos")
    tabla.innerHTML = "";
    datos.forEach(element => {
        let tr = document.createElement("tr");
        let tdSerial = document.createElement("td");
        let tdNombre = document.createElement("td");
        let tdAcciones = document.createElement("td");
        let tdMarca = document.createElement("td");
        let btnObservar = document.createElement("button");
        let btnEliminar = document.createElement("button");
        let btnAgregarObservacion = document.createElement("button")
        let div = document.createElement("div")


        btnAgregarObservacion.textContent = "Agregar observacion";
        btnEliminar.textContent = "Eliminar";
        btnObservar.textContent = "Ver observaciones";

        div.setAttribute("class", "btn-group")
        btnObservar.setAttribute("data-bs-toggle", "modal")
        btnObservar.setAttribute("data-bs-target", "#modalVerObservaciones")
        btnAgregarObservacion.setAttribute("data-bs-toggle", "modal")
        btnAgregarObservacion.setAttribute("data-bs-target", "#modalAgregarObservacion")

        btnAgregarObservacion.setAttribute("onclick", `modalOnservacion('${element.serialInstrumento}')`)

        btnEliminar.setAttribute("onclick", `EliminarInstrumento('${element.serialInstrumento}')`)
        btnObservar.setAttribute("onclick", `ObservarInstrumento('${element.serialInstrumento}')`)

        btnAgregarObservacion.setAttribute("class", "btn btn-outline-success")
        btnEliminar.setAttribute("class", "btn btn-outline-danger")
        btnObservar.setAttribute("class", "btn btn-outline-info")

        tdNombre.textContent = element.nombreInstrumento;
        tdSerial.textContent = element.serialInstrumento;
        tdMarca.textContent = element.marcaInstrumento;

        div.appendChild(btnObservar)
        div.appendChild(btnAgregarObservacion)
        div.appendChild(btnEliminar)


        tdAcciones.appendChild(div)

        tr.appendChild(tdNombre)
        tr.appendChild(tdSerial)
        tr.appendChild(tdMarca)
        tr.appendChild(tdAcciones)
        tabla.appendChild(tr)
    });



}

function EliminarInstrumento(id) {
    var confirmacion = confirm("¿Estás seguro de que deseas continuar?, el registro se eliminara permanentemente");
    if (confirmacion) {
        let peticion = new XMLHttpRequest()
        peticion.open("post", "/eliminarInstrumento");
        peticion.setRequestHeader("content-type", "application/json")
        peticion.onload = () => {
            if (peticion.status == 200) {
                let resp = JSON.parse(peticion.responseText)
                if (resp.respuesta == "eliminado") {
                    alert("Los datos han sido eliminados exitosamente.")
                    location.reload(true)
                } else if (resp.respuesta == "fatalError") {
                    alert("Error fatal, contactar al desarrollador")
                }
            }
        }
        peticion.send(JSON.stringify({ id: id }))
    }
}

function ObservarInstrumento(id) {
    let server = new XMLHttpRequest()
    server.open("post", "/datosObservacionesInstrumentos");
    server.setRequestHeader("content-type", "application/json")
    server.onload = () => {
        if (server.status == 200) {
            let resp = JSON.parse(server.responseText)
            dibujarTablaObservaciones(resp)
        }
    }
    server.send(JSON.stringify({ id: id }))
}

function modalOnservacion(id) {
    let server = new XMLHttpRequest();
    server.open("post", "/datosInstrumento");
    server.setRequestHeader("content-type", "application/json");
    server.onload = () => {
        if (server.status == 200) {
            let datos = JSON.parse(server.responseText);
            if (datos.respuesta != 'undefined') {

                let btnAgregarObservacion = document.getElementById("btnAgregarObservacion");
                let nombreInstrumentoObservacion = document.getElementById("nombreInstrumentoObservacion");
                let serialInstrumentoObservacion = document.getElementById("serialInstrumentoObservacion");
                let marcaInstrumentoObservacion = document.getElementById("marcaInstrumentoObservacion");

                btnAgregarObservacion.setAttribute("onclick", `guardarObservacion('${datos.serialInstrumento}')`)
                nombreInstrumentoObservacion.textContent = datos.nombreInstrumento;
                serialInstrumentoObservacion.textContent = datos.serialInstrumento;
                marcaInstrumentoObservacion.textContent = datos.marcaInstrumento;
            } else {
                alert("Fallo severo, contactar al desarrollador")
            }
        } else {
            alert("Fallo severo, contactar al desarrollador")
        }
    }
    server.send(JSON.stringify({ id: id }))
}

function cancelarInstrumento() {
    document.getElementById("nombreInstrumento").value = "";
    document.getElementById("serialInstrumento").value = "";
    document.getElementById("observacionInstrumento").value = "";
    document.getElementById("marcaInstrumento").value = "";
}

function guardarInstrumentos() {
    let nombreInstrumento = document.getElementById("nombreInstrumento");
    let serialInstrumento = document.getElementById("serialInstrumento");
    let observacionInstrumento = document.getElementById("observacionInstrumento");
    let marcaInstrumento = document.getElementById("marcaInstrumento");
    if (nombreInstrumento.value == "") {
        nombreInstrumento.setCustomValidity("Este campo es obligatorio.");
        nombreInstrumento.reportValidity();
        return;
    }
    if (serialInstrumento.value == "") {
        serialInstrumento.setCustomValidity("Este campo es obligatorio.");
        serialInstrumento.reportValidity();
        return;
    }
    if (marcaInstrumento.value == "") {
        marcaInstrumento.setCustomValidity("Este campo es obligatorio.");
        marcaInstrumento.reportValidity();
        return;
    }
    if (observacionInstrumento.value == "") {
        observacionInstrumento.setCustomValidity("Este campo es obligatorio.");
        observacionInstrumento.reportValidity();
        return;
    }
    nombreInstrumento = nombreInstrumento.value;
    serialInstrumento = serialInstrumento.value;
    marcaInstrumento = marcaInstrumento.value;
    observacionInstrumento = observacionInstrumento.value;


    let datos = {
        nombreInstrumento: nombreInstrumento,
        serialInstrumento: serialInstrumento,
        observacionInstrumento: observacionInstrumento,
        marcaInstrumento: marcaInstrumento
    }

    let peticion = new XMLHttpRequest();
    peticion.open("post", "/guardarInstrumento");
    peticion.setRequestHeader("Content-Type", "application/json");
    peticion.onload = () => {
        if (peticion.status == 200) {
            let res = JSON.parse(peticion.responseText);
            if (res.respuesta == "Inserción exitosa") {
                alert("El instrumento ha sido guardado correctamente.")
                location.reload()
            }
        }
    }
    peticion.send(JSON.stringify(datos));


}

function cancelarObservacion() {
    document.getElementById("nombreInstrumentoObservacion").textContent = "";
    document.getElementById("serialInstrumentoObservacion").textContent = "";
    document.getElementById("nuevaObservacion").value = "";
    document.getElementById("marcaInstrumentoObservacion").textContent = "";
}

function guardarObservacion() {
    let nuevaObservacion = document.getElementById("nuevaObservacion");
    console.log(nuevaObservacion.value)
    if (nuevaObservacion.value == "") {
        nuevaObservacion.setCustomValidity("Este campo es requerido");
        nuevaObservacion.reportValidity();
        return;
    }
    nuevaObservacion = nuevaObservacion.value;
    let nombreInstrumentoObservacion = document.getElementById("nombreInstrumentoObservacion").textContent;
    let marcaInstrumentoObservacion = document.getElementById("marcaInstrumentoObservacion").textContent;
    let serialInstrumentoObservacion = document.getElementById("serialInstrumentoObservacion").textContent;

    let ruta = new XMLHttpRequest();
    ruta.open("post", "/guardarObservacion");
    ruta.setRequestHeader("content-type", "application/json");
    ruta.onload = () => {
        if (ruta.status == 200) {
            let resp = JSON.parse(ruta.responseText)
            if (resp.respuesta == "guardado") {
                alert("La observación se ha guardado exitosamente")
                document.getElementById("btnCancelarObservacion").click();
            }
            else if (resp.respuesta == "errorFatal") {
                alert("Error fatal, contactar al desarrollador")
            }
        }
    }
    let nuevoRegistro = {
        nombreInstrumentoObservacion: nombreInstrumentoObservacion,
        marcaInstrumentoObservacion: marcaInstrumentoObservacion,
        serialInstrumentoObservacion: serialInstrumentoObservacion,
        nuevaObservacion: nuevaObservacion
    }
    ruta.send(JSON.stringify(nuevoRegistro))
}

function dibujarTablaObservaciones(datos) {
    let tabla = document.getElementById("tblObservaciones")
    let btnAgregarObservacionModal = document.getElementById("btnAgregarObservacionModal")
    tabla.innerHTML = "";
    datos.forEach(element => {
        document.getElementById("serialInstrumentoActualizacion").value = element.serial;
        btnAgregarObservacionModal.setAttribute("onclick", `modalOnservacion('${element.serial}')`)

        let tr = document.createElement("tr");
        let tdNombre = document.createElement("td");
        let tdMarca = document.createElement("td")
        let tdSerial = document.createElement("td");
        let tdFecha = document.createElement("td");
        let tdObservacion = document.createElement("td");
        let tdAcciones = document.createElement("td")
        let btnEditar = document.createElement("button")
        let btnEliminar = document.createElement("button")

        btnEditar.textContent = ("Editar");
        btnEliminar.textContent = ("Eliminar");

        btnEditar.setAttribute("data-bs-toggle", "modal");
        btnEditar.setAttribute("onclick", `editarObservacion('${element._id}')`);
        btnEliminar.setAttribute("onclick", `eliminarObservacion('${element._id}','${element.serial}')`);

        btnEditar.setAttribute("data-bs-target", "#modalActualizarObservacion");
        btnEditar.setAttribute("class", "btn btn-outline-success");
        btnEliminar.setAttribute("class", "btn btn-outline-danger");


        tdAcciones.setAttribute("class", "btn-group")

        tdObservacion.id = element._id;
        tdNombre.textContent = element.nombre;
        tdMarca.textContent = element.marca;
        tdSerial.textContent = element.serial;
        tdFecha.textContent = element.fecha;
        tdObservacion.textContent = element.observacion;
        tdAcciones.appendChild(btnEditar)
        tdAcciones.appendChild(btnEliminar)

        tr.appendChild(tdNombre)
        tr.appendChild(tdMarca)
        tr.appendChild(tdSerial)
        tr.appendChild(tdFecha)
        tr.appendChild(tdObservacion)
        tr.appendChild(tdAcciones)
        tabla.appendChild(tr)
    });
}

function cerrarVerObservacion() {
    document.getElementById("tblObservaciones").innerHTML = "";
}

function editarObservacion(id) {
    document.getElementById("actualizarObservacion").textContent = "";
    document.getElementById("actualizarObservacion").textContent = document.getElementById(id).textContent;
    document.getElementById("btnGuardarActualizacionObservacion").setAttribute("onclick", `guardarActualizacionDeObservacion('${id}')`)

}

function guardarActualizacionDeObservacion(id) {
    let observacion = document.getElementById("actualizarObservacion");
    if (observacion.value == "") {
        observacion.setCustomValidity("Campo obligatorio");
        observacion.reportValidity();
        return;
    }
    observacion = observacion.value;
    let serial = document.getElementById("serialInstrumentoActualizacion").value;
    let act = new XMLHttpRequest();
    act.open("post", "/guardarActualizacionObservacion");
    act.setRequestHeader("content-type", "application/json");
    act.onload = () => {
        if (act.status == 200) {
            let resp = JSON.parse(act.responseText);
            if (resp.respuesta == "fatalError") {
                alert("Error fatal, contactar al desarrollador")
            }
            else {
                alert("Actualización exitosa")
                dibujarTablaObservaciones(resp);
            }
        }
    }
    act.send(JSON.stringify({ id: id, observacion: observacion, serial: serial }))
}

function eliminarObservacion(id, serial) {
    var confirmacion = confirm("¿Estás seguro de que deseas continuar?, el registro no se podrá recuperar");
    if (confirmacion) {
        let servidor = new XMLHttpRequest();
        servidor.open("post", "/eliminarObservacion");
        servidor.setRequestHeader("content-type", "application/json");
        servidor.onload = () => {
            if (servidor.status == 200) {
                let { respuesta, datos } = JSON.parse(servidor.responseText);
                if (respuesta == "errorFatal") {
                    alert("Error fatal, contactar al desarrollador")
                } else {
                    alert("Eliminación exitosa")
                    dibujarTablaObservaciones(datos);
                }
            }
        }
        servidor.send(JSON.stringify({ id: id, serial: serial }))
    }
}






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