// Listener para recibir solicitudes desde content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStoredStyles") {
        console.log(":sobre_con_flecha: Recibida solicitud de estilos desde content.js...");
        // Obtener la configuración almacenada en chrome.storage.sync
        chrome.storage.sync.get(["fontFamily", "fontSize", "fontColor"], (data) => {
            console.log(":arte: Enviando estilos guardados:", data);
            // Responder con los valores guardados o valores por defecto
            sendResponse({
                fontFamily: data.fontFamily || "Verdana, sans-serif",
                fontSize: data.fontSize || "13px",
                fontColor: data.fontColor || "#000000"
            });
        });
        return true; // Indica que la respuesta será enviada de forma asíncrona
    }
});
// :chincheta: Nuevo: Listener para abrir la ventana flotante al hacer clic en la extensión
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"), // Carga el popup en una ventana aparte
        type: "popup",
        width: 310,
        height: 430,
        top: 100, // Posición en la pantalla
        left: 100
    });
});

