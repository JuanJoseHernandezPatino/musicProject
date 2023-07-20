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

