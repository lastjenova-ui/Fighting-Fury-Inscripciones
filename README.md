# Liga FGC - Inscripciones

Aplicación web gratuita para gestionar inscripciones de una liga de videojuegos o fighting games usando HTML, CSS, JavaScript Vanilla, Google Apps Script, Google Sheets, Google Drive y GitHub Pages.

## Archivos incluidos

- `index.html`: interfaz principal con formulario y lista pública de inscritos.
- `styles.css`: diseño responsive con estética oscura inspirada en esports.
- `script.js`: validaciones, envío del formulario, carga de la lista pública y filtros.
- `Code.gs`: backend de Google Apps Script para validar, guardar comprobantes y registrar datos.

## Estructura de Google Sheets

Crea una hoja llamada `Inscripciones` con estas columnas en la fila 1:

1. `Fecha y hora`
2. `Nombre completo`
3. `Nick`
4. `CFN`
5. `Número celular`
6. `Equipo competitivo`
7. `URL del comprobante`
8. `Estado`

Toda nueva inscripción se guardará con `Estado = Pendiente`.

## Despliegue paso a paso

### 1. Crear Google Sheet

1. Crea un nuevo Google Sheet.
2. Renombra la primera hoja como `Inscripciones`.
3. Agrega los encabezados exactamente como se muestran arriba.
4. Copia el ID del Sheet desde la URL.

### 2. Crear carpeta de Google Drive

1. Crea una carpeta nueva en Google Drive para los comprobantes.
2. Copia el ID de la carpeta desde la URL.
3. Mantén la carpeta privada; el organizador podrá abrir los archivos desde el enlace guardado en Sheets.

### 3. Configurar Google Apps Script

1. Abre [Google Apps Script](https://script.google.com/).
2. Crea un proyecto nuevo.
3. Reemplaza el contenido del archivo `Code.gs` con el contenido de `F:\Proyecto\Code.gs`.
4. Cambia estas constantes:

```javascript
const SHEET_ID = 'TU_ID_DE_GOOGLE_SHEET';
const DRIVE_FOLDER_ID = 'TU_ID_DE_CARPETA_DRIVE';
```

5. Guarda el proyecto.

### 4. Publicar como Web App

1. Haz clic en `Deploy` > `New deployment`.
2. Selecciona `Web app`.
3. En `Execute as`, selecciona `Me`.
4. En `Who has access`, selecciona `Anyone`.
5. Publica y autoriza los permisos solicitados.
6. Copia la URL del Web App.

### 5. Conectar el frontend

1. Abre `F:\Proyecto\script.js`.
2. Reemplaza esta línea:

```javascript
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

3. Pega la URL de tu Web App.

### 6. Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube `index.html`, `styles.css` y `script.js`.
3. Opcionalmente guarda `README.md` y `Code.gs` en el mismo repo como referencia.
4. En GitHub, entra a `Settings` > `Pages`.
5. En `Source`, elige `Deploy from a branch`.
6. Selecciona la rama principal y la carpeta `/root`.
7. Guarda los cambios y espera a que GitHub Pages genere la URL pública.

## Pruebas recomendadas

### Registro exitoso

1. Completa el formulario con datos válidos.
2. Adjunta una imagen de menos de 5 MB.
3. Envía el formulario.
4. Verifica que aparezca el mensaje `¡Inscripción registrada correctamente!`.
5. Confirma que el registro aparezca en la tabla pública.
6. Revisa en Google Sheets que el estado sea `Pendiente`.
7. Revisa que el comprobante se haya guardado en Google Drive.

### CFN duplicado

1. Intenta registrar otro jugador con el mismo `CFN`.
2. Debe aparecer el mensaje:

```text
Ya existe una inscripción registrada con este CFN.
```

### Cambio de estado

1. En Google Sheets, cambia manualmente `Pendiente` por `Verificado`.
2. Recarga la web.
3. Confirma que el estado actualizado aparezca en la lista pública.

## Seguridad y buenas prácticas incluidas

- Validación de campos obligatorios.
- Validación de celular con formato numérico.
- Validación de tipos de imagen permitidos.
- Validación de tamaño máximo de 5 MB.
- Saneamiento básico de texto para reducir errores e inyecciones.
- Bloqueo de registros duplicados por `CFN`.
- Verificación opcional de duplicado por `Nick`.
- La lista pública no expone nombre real, celular ni URL del comprobante.

## Personalización rápida

- Cambia el logo editable directamente en `index.html` dentro de `.brand-logo`.
- Cambia el nombre de la liga en el `h1`.
- Ajusta colores globales en `styles.css` dentro de `:root`.

## Notas importantes

- GitHub Pages solo publica el frontend estático.
- El backend y el almacenamiento dependen de Google Apps Script, Google Sheets y Google Drive.
- Si el navegador bloquea la lectura del resultado, vuelve a desplegar el Apps Script verificando que el acceso sea `Anyone`.
