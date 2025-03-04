console.log("📌 La extensión se ha cargado correctamente.");

// Función para obtener el cuerpo del correo
function getEmailBody() {
    return document.querySelector("[role='textbox']");
}

// Observador para detectar el botón "Enviar" y agregar el botón "Estilizar"
const observer = new MutationObserver(() => {
    console.log("🔍 Observando cambios en el DOM...");

    const sendButton = document.querySelector(".aoO");
    if (sendButton && !document.getElementById("formatButton")) {
        console.log("✅ Botón 'Enviar' encontrado.");
        addCustomButton(sendButton);
    }

    // Aplicar configuración guardada automáticamente
    //applySavedSettings();
});

// Iniciar el observador
observer.observe(document.body, { childList: true, subtree: true });


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

    sendButton.parentNode.appendChild(formatButton);
    console.log("📌 Botón agregado junto al botón 'Enviar'.");

    formatButton.addEventListener("click", () => {
        console.log("🖊️ Botón 'Estilizar' presionado.");
        applySavedSettings();
    });
}

function applySavedSettings() {
    let emailBody = getEmailBody();

    if (emailBody) {
        console.log("✅ Área de redacción encontrada. Aplicando formato en el HTML...");

        // Pedir los valores guardados al background.js
        chrome.runtime.sendMessage({ action: "getStoredStyles" }, (response) => {
            if (chrome.runtime.lastError) {
                console.log("⚠️ Error en la respuesta del background:", chrome.runtime.lastError.message);
                return;
            }

            if (response) {
                const { fontFamily, fontSize, fontColor } = response;

                console.log("🎨 Aplicando formato con datos obtenidos:", response);

                // Aplicamos los estilos dinámicamente usando los valores almacenados
                let content = emailBody.innerHTML;
                content = `<span style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${fontColor};">${content}</span>`;
                emailBody.innerHTML = content;

                console.log("✨ Formato aplicado directamente en el contenido del correo.");
            } else {
                console.log("⚠️ No se recibieron datos desde el background.");
            }
        });
    } else {
        console.log("❌ No se encontró el área de redacción.");
    }
}

