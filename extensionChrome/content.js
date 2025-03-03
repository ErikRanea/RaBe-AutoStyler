console.log("📌 La extensión se ha cargado correctamente.");

// Esperamos cambios en el cuerpo del documento
const observer = new MutationObserver(() => {
    console.log("🔍 Observando cambios en el DOM...");

    // Buscar botón de enviar
    const sendButton = document.querySelector(".aoO");

    if (sendButton && !document.getElementById("formatButton")) {
        console.log("✅ Botón 'Enviar' encontrado.");
        addCustomButton(sendButton);
    }
});

// Iniciamos el observador
observer.observe(document.body, { childList: true, subtree: true });

function addCustomButton(sendButton) {
    console.log("🛠️ Creando botón personalizado...");

    let formatButton = document.createElement("button");
    formatButton.innerText = "📌 Formatear";
    formatButton.id = "formatButton";
    formatButton.style.cssText = `
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
        font-size: 12px;
    `;

    sendButton.parentNode.appendChild(formatButton);
    console.log("📌 Botón agregado junto al botón 'Enviar'.");

    formatButton.addEventListener("click", () => {
        console.log("🖊️ Botón 'Formatear' presionado.");

        let emailBody = document.querySelector(".Am.Al.editable");
        if (emailBody) {
            console.log("✅ Área de redacción encontrada. Aplicando formato...");
            emailBody.style.fontFamily = "Verdana";
            emailBody.style.color = "black";
            emailBody.style.fontSize = "14px";
            console.log("🎨 Formato aplicado: Verdana, negro, tamaño 14px.");
            setTimeout(() => {
                resaltarPalabras();
            }, 100);
        } else {
            console.log("❌ No se encontró el área de redacción.");
        }
    });
}

function resaltarPalabras() {
    // Definir las frases a buscar
    console.log("Cargando resaltar palabras");
    const phrases = ["ven a malta", "spanish party"];

    // Seleccionar el cuerpo del correo (ajustar el selector según la plataforma)
    const emailBody = document.querySelector(".Am.Al.editable");

    if (emailBody) {
        console.log("Body del correo encontrado");
        let content = emailBody.innerHTML; // Obtener el contenido en HTML

        // Reemplazar cada frase con su versión en negrita
        phrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, "gi"); // 'gi' = insensible a mayúsculas
            content = content.replace(regex, "<strong>$1</strong>");
        });

        emailBody.innerHTML = content; // Actualizar el contenido con las frases resaltadas
    }
    else{
        console.log("Body del correo no encontrado");
    }
}
