// Listener para recibir solicitudes desde content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStoredStyles") {
        console.log("📩 Recibida solicitud de estilos desde content.js...");
        // Obtener la configuración almacenada en chrome.storage.sync
        chrome.storage.sync.get(["fontFamily", "fontSize", "fontColor"], (data) => {
            console.log("🎨 Enviando estilos guardados:", data);
            sendResponse({
                fontFamily: data.fontFamily || "Verdana, sans-serif",
                fontSize: data.fontSize || "13px",
                fontColor: data.fontColor || "#000000"
            });
        });
        return true; // Indica que la respuesta será enviada de forma asíncrona
    }

    // 🔄 Recargar Gmail cuando el popup lo solicite
    if (request.action === "reloadGmail") {
        console.log("🔄 Recargando Gmail...");
        chrome.tabs.query({ url: "https://mail.google.com/*" }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.reload(tabs[0].id);
                console.log("✅ Gmail recargado con éxito.");
            } else {
                console.log("❌ No se encontró una pestaña de Gmail abierta.");
            }
        });
    }
});

// 📌 Nuevo: Listener para abrir la ventana flotante al hacer clic en la extensión
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"), // Carga el popup en una ventana aparte
        type: "popup",
        width: 310,
        height: 430,
        top: 100,
        left: 100
    });
});
