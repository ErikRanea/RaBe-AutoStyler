# 🚀 RaBe - AutoStyler

**RaBe - AutoStyler** es una extensión de Chrome desarrollada por **Iñigo Berastegi** y **Erik Ranea** que permite personalizar automáticamente el formato de los correos en Gmail. Con esta herramienta, puedes aplicar tipografía, tamaño y color personalizados en el área de redacción, asegurando una apariencia consistente y profesional en tus mensajes.

---

## 📥 Instalación

1. **Desde Chrome Web Store** *(cuando esté publicada)*:
   - Dirígete a la [Chrome Web Store](https://chrome.google.com/webstore) y busca **RaBe - AutoStyler**.
   - Haz clic en **Añadir a Chrome** y confirma la instalación.

2. **Desde código fuente (modo desarrollador)**:
   - Descarga este repositorio o clónalo con:
     ```bash
     git clone https://github.com/tu-usuario/RaBe-AutoStyler.git
     ```
   - Abre **Google Chrome** y accede a:  
     `chrome://extensions/`
   - Habilita el **Modo Desarrollador** (esquina superior derecha).
   - Haz clic en **Cargar descomprimida** y selecciona la carpeta del repositorio.

---

## 🎨 **¿Cómo funciona?**

1. **Abre Gmail** y redacta un nuevo correo.
2. Haz clic en el botón **"Estilizar"**, que se encuentra junto al botón de **Enviar**.
3. La extensión aplicará automáticamente los estilos configurados (tipografía, tamaño y color).
4. También puedes personalizar los estilos desde el **popup de configuración**.

---

## ⚙️ **Configuración de estilos**
Puedes personalizar los estilos de texto accediendo al **panel de configuración**:

1. Haz clic en el icono de la extensión en la barra de herramientas.
2. Configura:
   - **Tipografía** (ejemplo: Verdana, Arial, Times New Roman).
   - **Tamaño de fuente** (ejemplo: 13px, 16px, etc.).
   - **Color de fuente**.
3. Guarda los cambios y la extensión aplicará los estilos en Gmail.

---

## 🛠 **Permisos utilizados**
RaBe - AutoStyler requiere los siguientes permisos para funcionar correctamente:

- **`activeTab`** → Detecta si la pestaña activa es Gmail y aplica cambios en la redacción.
- **`scripting`** → Inyecta código en Gmail para modificar el área de redacción.
- **`storage`** → Guarda las preferencias del usuario (tipografía, tamaño, color).
- **`tabs`** → Detecta pestañas de Gmail abiertas para aplicar cambios.
- **`host_permissions` (mail.google.com)** → Modifica el contenido del editor de correos.

---

## 📝 **Desarrolladores**
👨‍💻 **Iñigo Berastegi**  
👨‍💻 **Erik Ranea**  

Si deseas contribuir, puedes hacer un **fork** del repositorio y enviar un **pull request** con mejoras.

---

## 📜 **Política de Privacidad**
Esta extensión **no recopila, almacena ni transmite información personal**. Toda la configuración se guarda localmente en tu navegador a través de `chrome.storage.sync`.

🔗 **[Ver política de privacidad](https://tu-usuario.github.io/RaBe-AutoStyler/privacy-policy.html)**

---

🎉 **¡Gracias por usar RaBe - AutoStyler!** 🚀✨
