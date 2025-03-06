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

    if (!emailBody) {
        console.log("❌ No se encontró el área de redacción.");
        return;
    }

    console.log("✅ Área de redacción encontrada. Aplicando formato en el HTML...");

    // Buscar el último div[dir="ltr"] anidado
    let innerDiv = emailBody.querySelector('div[dir="ltr"]');

    while (innerDiv && innerDiv.querySelector('div[dir="ltr"]')) {
        innerDiv = innerDiv.querySelector('div[dir="ltr"]'); // Avanzamos al div más profundo
    }

    // 📩 Buscar TODOS los div.gmail_default dentro de innerDiv
    let gmailDefaults = innerDiv ? innerDiv.querySelectorAll('div.gmail_default') : [];

    if (gmailDefaults.length === 0) {
        console.log("⚠️ No se encontraron div.gmail_default, aplicando formato directamente en emailBody.");
        gmailDefaults = [emailBody]; // Usamos el emailBody como fallback
    }

    // Pedir los valores guardados al background.js
    chrome.runtime.sendMessage({ action: "getStoredStyles" }, (response) => {
        if (chrome.runtime.lastError) {
            console.log("⚠️ Error en la respuesta del background:", chrome.runtime.lastError.message);
            return;
        }

        if (!response) {
            console.log("⚠️ No se recibieron datos desde el background.");
            return;
        }

        const { fontFamily, fontSize, fontColor } = response;
        console.log(`🎨 Aplicando formato en ${gmailDefaults.length} elementos encontrados.`);

        // Aplicar estilos en cada div.gmail_default
        gmailDefaults.forEach((div) => {
            let content = div.innerHTML;

            // Expresión regular para detectar si ya existe un <span> envolviendo el contenido
            const spanRegex = /^<span[^>]*>(.*?)<\/span>$/is;

            if (spanRegex.test(content)) {
                console.log("🔄 Se detectó un <span> existente, actualizando estilos...");
                div.firstElementChild.style.fontFamily = fontFamily;
                div.firstElementChild.style.fontSize = fontSize;
                div.firstElementChild.style.color = fontColor;
            } else {
                console.log("🆕 No se detectó un <span>, agregando uno nuevo...");
                content = `<span style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${fontColor};">${content}</span>`;
                div.innerHTML = content;
            }
        });

        console.log("✨ Formato aplicado correctamente.");
    });
}
