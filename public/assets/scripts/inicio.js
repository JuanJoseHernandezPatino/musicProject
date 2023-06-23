function monitoria(value) {
    if (value == "Si") {
        document.getElementById("pnlMunicipioRegistro").style.display = "block";
    }
    else {
        document.getElementById("pnlMunicipioRegistro").style.display = "none";
    }
}


function guardarRegistro() {
    let txtNombresRegistro = document.getElementById("txtNombresRegistro").value;
    if (txtNombresRegistro == "" || txtNombresRegistro == null) {
        alert("Son necesarios todos los campos");
        return;
    }
    let txtApellidosRegistro = document.getElementById("txtApellidosRegistro").value;
    if (txtApellidosRegistro == "" || txtApellidosRegistro == null) {
        alert("Son necesarios todos los campos");
        return;
    }
    let txtCorreoRegistro = document.getElementById("txtCorreoRegistro").value;
    if (txtCorreoRegistro == "" || txtCorreoRegistro == null) {
        alert("Son necesarios todos los campos");
        return;
    }
    let txtContrasenaRegistro = document.getElementById("txtContrasenaRegistro").value;
    if (txtContrasenaRegistro == "" || txtContrasenaRegistro == null) {
        alert("Son necesarios todos los campos");
        return;
    }
    let sltMaestro = document.getElementById("sltMaestro").value;
    if (sltMaestro == "") {
        alert("Debe de seleccionar una opcion");
        return;
    }
    let txtContrasenaconfirmacion = document.getElementById("txtContrasenaconfirmacion").value;
    if (txtContrasenaconfirmacion == "" || txtContrasenaconfirmacion == null) {
        alert("Son necesarios todos los campos");
        return;
    }
    if (txtContrasenaRegistro != txtContrasenaconfirmacion) {
        alert("las contraseñas no coinciden")
        return;
    }
    let txtMunicipioRegistro = document.getElementById("txtMunicipioRegistro").value;
}
