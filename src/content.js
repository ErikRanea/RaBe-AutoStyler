console.log("📌 La extensión se ha cargado correctamente.");

// Función para obtener el cuerpo del correo
function getEmailBody() {
    return document.querySelector("[role='textbox']");
}

// Observador para detectar el botón "Enviar", el editor y agregar el botón "Estilizar"
const observer = new MutationObserver(() => {
    console.log("🔍 Observando cambios en el DOM...");

    const sendButton = document.querySelector(".aoO");
    if (sendButton && !document.getElementById("formatButton")) {
        console.log("✅ Botón 'Enviar' encontrado.");
        addCustomButton(sendButton);
    }

    const emailBody = getEmailBody();
    if (emailBody && !emailBody.dataset.pasteListenerAttached) {
        console.log("🧲 Interceptando pegado en el editor...");

        emailBody.addEventListener("paste", (event) => {
            event.preventDefault();

            const items = event.clipboardData.items;
            const textoPlano = event.clipboardData.getData("text/plain");
            const imagenes = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith("image/")) {
                    imagenes.push(item.getAsFile());
                }
            }

            chrome.runtime.sendMessage({ action: "getStoredStyles" }, (response) => {
                if (!response) return;
                const { fontFamily, fontSize, fontColor } = response;

               // 1. Verificar si el contenido ya pegado por Gmail coincide con el texto plano
                const contenidoActual = emailBody.innerText.trim();
                const textoPegado = textoPlano.trim();

                if (contenidoActual === textoPegado) {
                    console.log("🧹 Contenido pegado por Gmail detectado, será reemplazado.");
                    emailBody.innerHTML = "";
                } else {
                    console.log("🛑 El contenido no coincide con el texto pegado. No se borra.");
                }


                // 2. Insertar texto con estilo
                if (textoPlano) {
                    const lineas = textoPlano.split("\n");
                    const textoFragment = document.createDocumentFragment();

                    lineas.forEach((linea, index) => {
                        const span = document.createElement("span");
                        span.textContent = linea;
                        span.style.fontFamily = fontFamily;
                        span.style.fontSize = fontSize;
                        span.style.color = fontColor;
                        textoFragment.appendChild(span);

                        if (index < lineas.length - 1) {
                            textoFragment.appendChild(document.createElement("br"));
                        }
                    });

                    emailBody.appendChild(textoFragment);
                }

                // 3. Insertar imágenes (visual + adjunto real)
                if (imagenes.length > 0) {
                    imagenes.forEach((archivo) => {
                        const blobURL = URL.createObjectURL(archivo);

                        const img = document.createElement("img");
                        img.src = blobURL;
                        img.alt = archivo.name || "image";
                        img.setAttribute("data-surl", `cid:${crypto.randomUUID()}`);
                        img.style.maxWidth = "100%";
                        img.style.margin = "10px 0";

                        emailBody.appendChild(document.createElement("br"));
                        emailBody.appendChild(img);
                        emailBody.appendChild(document.createElement("br"));

                        simularAdjuntoEnGmail(archivo);
                    });
                }

                // 4. Colocar el cursor al final
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(emailBody);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);

                console.log("📎 Texto + imagen insertados y adjuntados correctamente.");
            });
        });

        emailBody.dataset.pasteListenerAttached = "true";
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

    let innerDiv = emailBody.querySelector('div[dir="ltr"]');
    while (innerDiv && innerDiv.querySelector('div[dir="ltr"]')) {
        innerDiv = innerDiv.querySelector('div[dir="ltr"]');
    }

    let gmailDefaults = innerDiv ? innerDiv.querySelectorAll('div.gmail_default') : [];
    let divVacio = innerDiv ? innerDiv.querySelector('div') : [];

    if (gmailDefaults.length === 0) {
        console.log("⚠️ No se encontraron div.gmail_default, aplicando formato directamente en emailBody.");
        gmailDefaults = [emailBody];
    }

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

        gmailDefaults.forEach((div) => {
            let content = div.innerHTML;
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

// 🛠️ Simula la inserción del archivo en el input oculto de Gmail para que se envíe como adjunto real
function simularAdjuntoEnGmail(file) {
    const inputAdjunto = document.querySelector('input[type="file"][name="Filedata"]');

    if (!inputAdjunto) {
        console.warn("❌ No se encontró input de adjunto de Gmail.");
        return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    inputAdjunto.files = dataTransfer.files;

    const event = new Event("change", { bubbles: true });
    inputAdjunto.dispatchEvent(event);

    console.log("📎 Imagen enviada como adjunto correctamente.");
}
