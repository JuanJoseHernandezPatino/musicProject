//#region funciones del registro    
function monitoria(value) {
    if (value == "Si") {
        document.getElementById("pnlMunicipioRegistro").style.display = "block";
    }
    else {
        document.getElementById("pnlMunicipioRegistro").style.display = "none";
    }
}

async function guardarRegistro() {
    try {

        let txtNombresRegistro = document.getElementById("txtNombresRegistro");
        let txtApellidosRegistro = document.getElementById("txtApellidosRegistro");
        let txtCorreoRegistro = document.getElementById("txtCorreoRegistro");
        let txtContrasenaRegistro = document.getElementById("txtContrasenaRegistro");
        let txtContrasenaconfirmacion = document.getElementById("txtContrasenaconfirmacion");

        let sltMaestro = document.getElementById("sltMaestro");
        let txtMunicipioRegistro = document.getElementById("txtMunicipioRegistro");


        if (txtNombresRegistro.value == "") {
            txtNombresRegistro.setCustomValidity("Este campo es obligatorio.");
            txtNombresRegistro.reportValidity();
            return;
        } else if (txtApellidosRegistro.value == "") {
            txtApellidosRegistro.setCustomValidity("Este campo es obligatorio.");
            txtApellidosRegistro.reportValidity();
            return;
        } else if (txtCorreoRegistro.value == "") {
            txtCorreoRegistro.setCustomValidity("Este campo es obligatorio.");
            txtCorreoRegistro.reportValidity();
            return;
        } else if (txtContrasenaRegistro.value == "") {
            txtContrasenaRegistro.setCustomValidity("Este campo es obligatorio.");
            txtContrasenaRegistro.reportValidity();
            return;
        } else if (txtContrasenaconfirmacion.value == "") {
            txtContrasenaconfirmacion.setCustomValidity("Este campo es obligatorio.");
            txtContrasenaconfirmacion.reportValidity();
            return;
        } else if (txtContrasenaRegistro.value != txtContrasenaconfirmacion.value) {
            alert("las contraseñas no coinciden")
            return;
        } else if (sltMaestro.value == "") {
            sltMaestro.setCustomValidity("Seleccione una opcion.");
            sltMaestro.reportValidity();
            return;
        } else if (sltMaestro.value == "Si" && txtMunicipioRegistro.value == "") {
            txtMunicipioRegistro.setCustomValidity("Este campo es obligatorio.");
            txtMunicipioRegistro.reportValidity();
            return;
        }

        let datos = {
            txtNombresRegistro: txtNombresRegistro.value,
            txtApellidosRegistro: txtApellidosRegistro.value,
            txtCorreoRegistro: txtCorreoRegistro.value,
            txtContrasenaRegistro: txtContrasenaRegistro.value,
            sltMaestro: sltMaestro.value,
            txtContrasenaconfirmacion: txtContrasenaconfirmacion.value,
            txtMunicipioRegistro: txtMunicipioRegistro.value
        }

        let respuesta = await server("post", datos, "/cargarRegistro");
        if (respuesta == "exito") {
            alert("Datos cargados correctamente")
            limpiarRegistro()
            var btnCerrarRegistro = document.getElementById('btnCerrarRegistro');
            btnCerrarRegistro.click();
        } else if (respuesta == "error") {
            alert("Error al cargar los datos, contacte al desarrollador de la aplicacion")
        }
    } catch (error) {
        console.log(error)
    }
}

function limpiarRegistro() {
    document.getElementById("txtNombresRegistro").value = "";
    document.getElementById("txtApellidosRegistro").value = "";
    document.getElementById("txtCorreoRegistro").value = "";
    document.getElementById("txtContrasenaRegistro").value = "";
    document.getElementById("txtContrasenaconfirmacion").value = "";
    document.getElementById("sltMaestro").value = "";
    document.getElementById("txtMunicipioRegistro").value = "";
}

//#endregion

function limpiarLogin() {
    document.getElementById("txtContrasenaLogin").value = "";
    document.getElementById("txtCorreologin").value = "";
}

let btnContraseña = false;
function cambioIcono() {
    if (btnContraseña == false) {
        btnContraseña = true;
        document.getElementById("passwordLogin").type = "password"
        document.getElementById("imgVer").style.display = "block"
        document.getElementById("imgNoVer").style.display = "none"
        var input = document.getElementById('passwordLogin');
        input.focus();
    } else {
        if (btnContraseña == true) {
            btnContraseña = false
            document.getElementById("passwordLogin").type = "text"
            document.getElementById("imgVer").style.display = "none"
            document.getElementById("imgNoVer").style.display = "block"
            var input = document.getElementById('passwordLogin');
            input.focus();
        }
    }
}

async function loguearse() {
    let txtCorreologin = document.getElementById("txtCorreologin");
    let passwordLogin = document.getElementById("passwordLogin");
    if (txtCorreologin.value == "") {
        txtCorreologin.setCustomValidity("Este campo es obligatorio.");
        txtCorreologin.reportValidity();
        return;
    } else if (passwordLogin.value == "") {
        passwordLogin.setCustomValidity("Este campo es obligatorio.");
        passwordLogin.reportValidity();
        return;
    }
    let datos = {
        txtCorreologin: txtCorreologin.value,
        passwordLogin: passwordLogin.value
    }
    let respuesta = server("post", datos, "/loguearse")

}

function server(tipoPeticion, datos, ruta) {
    return new Promise((resolve, reject) => {
        fetch(ruta, {
            method: tipoPeticion,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error en la solicitud");
                }
            })
            .then(data => resolve(data.respuesta))
            .catch(error => reject(error));
    });
}