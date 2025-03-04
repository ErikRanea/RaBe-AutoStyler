console.log("📌 La extensión se ha cargado correctamente.");

// Función para obtener el cuerpo del correo
function getEmailBody() {
    return document.querySelector("[role='textbox']");
}

// Observador para detectar el botón "Enviar" y agregar el botón "Estilizar"
const observer = new MutationObserver((mutations, observer) => {
    console.log("🔍 Observando cambios en el DOM...");

    const sendButton = document.querySelector(".aoO");
    if (sendButton && !document.getElementById("formatButton")) {
        console.log("✅ Botón 'Enviar' encontrado.");
        addCustomButton(sendButton);
    }
});

// Iniciamos el observador
observer.observe(document.body, { childList: true, subtree: true });

// Observador para detectar cambios en el área de redacción
const editorObserver = new MutationObserver(() => {
    console.log("🔄 Detectado cambio en el editor, actualizando referencia...");
});

// Función para iniciar la observación del editor
function startEditorObserver() {
    let emailBody = getEmailBody();
    if (emailBody) {
        editorObserver.observe(emailBody, { childList: true, subtree: true });
        console.log("👀 Observando cambios en el editor...");
    }
}

function addCustomButton(sendButton) {
    console.log("🛠️ Creando botón personalizado...");

    let formatButton = document.createElement("button");
    formatButton.innerText = "Estilizar";
    formatButton.id = "formatButton";
    formatButton.style.cssText = `
        background-color: rgb(255, 255, 255);
        color: black;
        border: none;
        padding: 0 16px;
        border-radius: 50px;
        margin-left: 10px;
        cursor: pointer;
        font-size: .875rem;
        font-weight: 500;
        letter-spacing: 0.25px;
        font-family: 'Google Sans';
        border: 1px solid black;
        transition: background-color 0.3s ease;
    `;

    // Agregar efecto hover al botón
    formatButton.addEventListener("mouseover", () => {
        formatButton.style.backgroundColor = "rgb(230, 230, 230)";
    });
    formatButton.addEventListener("mouseout", () => {
        formatButton.style.backgroundColor = "rgb(255, 255, 255)";
    });

    sendButton.parentNode.appendChild(formatButton);
    console.log("📌 Botón agregado junto al botón 'Enviar'.");

    formatButton.addEventListener("click", () => {
        console.log("🖊️ Botón 'Estilizar' presionado.");

        let emailBody = getEmailBody();
        if (emailBody) {
            console.log("✅ Área de redacción encontrada. Aplicando formato en el HTML...");

            // Aplicamos los estilos como HTML en lugar de solo modificar la apariencia visual
            let content = emailBody.innerHTML;
            content = `<span style="font-family: Verdana, sans-serif; font-size: 13px; color: black;">${content}</span>`;

            emailBody.innerHTML = content;
            console.log("🎨 Formato aplicado directamente en el contenido del correo.");

            // Reiniciar la observación del editor para detectar cambios manuales
            startEditorObserver();
        } else {
            console.log("❌ No se encontró el área de redacción.");
        }
    });
}

