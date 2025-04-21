console.log("📌 La extensión se ha cargado correctamente.");

function getEmailBody() {
    return document.querySelector("[role='textbox']");
}

const observer = new MutationObserver(() => {
    console.log("🔍 Observando cambios en el DOM...");

    const sendButton = document.querySelector(".aoO");
    if (sendButton && !document.getElementById("formatButton")) {
        console.log("✅ Botón 'Enviar' encontrado.");
        addCustomButton(sendButton);
    }
});

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
    const emailBody = getEmailBody();
    if (!emailBody) {
        console.log("❌ No se encontró el área de redacción.");
        return;
    }

    chrome.runtime.sendMessage({ action: "getStoredStyles" }, (response) => {
        if (chrome.runtime.lastError || !response) {
            console.warn("⚠️ Error al obtener estilos:", chrome.runtime.lastError?.message || "Sin respuesta");
            return;
        }

        const { fontFamily, fontSize, fontColor } = response;

        // Eliminar divs vacíos al inicio
        while (
            emailBody.firstChild &&
            emailBody.firstChild.nodeType === Node.ELEMENT_NODE &&
            emailBody.firstChild.tagName === "DIV" &&
            emailBody.firstChild.innerText.trim() === ""
        ) {
            emailBody.firstChild.remove();
        }

        const treeWalker = document.createTreeWalker(
            emailBody,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node) => {
                    if (node.closest(".gmail_signature, blockquote")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        while (treeWalker.nextNode()) {
            const el = treeWalker.currentNode;
            if (el instanceof HTMLElement) {
                el.style.fontFamily = fontFamily;
                el.style.fontSize = fontSize;
                el.style.color = fontColor;

                // Elimina estilos conflictivos inline (opcional)
                if (el.hasAttribute("style")) {
                    el.removeAttribute("style");
                    el.style.fontFamily = fontFamily;
                    el.style.fontSize = fontSize;
                    el.style.color = fontColor;
                }
            }
        }

        // Aplica al propio emailBody si tiene texto suelto
        if (emailBody.childNodes.length === 1 && emailBody.firstChild.nodeType === Node.TEXT_NODE) {
            emailBody.style.fontFamily = fontFamily;
            emailBody.style.fontSize = fontSize;
            emailBody.style.color = fontColor;
        }

        console.log("✨ Estilo aplicado completamente.");
    });
}
