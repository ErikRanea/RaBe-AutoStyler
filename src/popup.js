document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Cargando configuración en el popup...");

    // Cargar configuraciones previas desde chrome.storage
    chrome.storage.sync.get(["fontFamily", "fontSize", "fontColor"], (data) => {
        document.getElementById("fontFamily").value = data.fontFamily || "Verdana, sans-serif";
        document.getElementById("fontSize").value = data.fontSize || "13px";
        document.getElementById("fontColor").value = data.fontColor || "#000000";
    });

    // Guardar configuración al hacer clic en "Guardar Configuración"
    document.getElementById("saveSettings").addEventListener("click", function () {
        const fontFamily = document.getElementById("fontFamily").value;
        const fontSize = document.getElementById("fontSize").value;
        const fontColor = document.getElementById("fontColor").value;

        // Guardar en chrome.storage.sync
        chrome.storage.sync.set({ fontFamily, fontSize, fontColor }, () => {
            console.log("✅ Configuración guardada:", { fontFamily, fontSize, fontColor });

            // Aplicar cambios automáticamente en Gmail sin necesidad de recargar
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: applySavedSettingsFromStorage
                    });
                }
            });

            console.log("📩 Enviando mensaje para recargar Gmail...");
            chrome.runtime.sendMessage({ action: "reloadGmail" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log("⚠️ Error enviando mensaje a background:", chrome.runtime.lastError.message);
                } else if (response && response.status === "success") {
                    console.log("✅ Confirmación recibida: Gmail será recargado.");
                // 📌 Cerrar el popup automáticamente después de guardar la configuración
                window.close();
                } else {
                    console.log("❌ No se recibió confirmación de recarga.");
                }
            });

        });
    });
});

// Esta función será ejecutada en content.js al guardar configuración
function applySavedSettingsFromStorage() {
    chrome.storage.sync.get(["fontFamily", "fontSize", "fontColor"], (data) => {
        const emailBody = document.querySelector(".Am.Al.editable");
        if (emailBody) {
            emailBody.style.fontFamily = data.fontFamily || "Verdana, sans-serif";
            emailBody.style.fontSize = data.fontSize || "13px";
            emailBody.style.color = data.fontColor || "#000000";
            console.log("🎨 Estilos aplicados desde popup:", data);
        } else {
            console.log("❌ No se encontró el área de redacción.");
        }
    });
}
