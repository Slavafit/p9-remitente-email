# Project Description 🚀
Una aplicación para planificar el número de personas invitadas a un evento. La aplicación le permite enviar invitaciones utilizando una plantilla de evento que contiene nombre, foto, fecha y hora de inicio, ubicación del evento, a un contacto o grupo de contactos seleccionados por correo electrónico. Reciba respuestas a cada evento y cada contacto en su lista de correo.

 **Se implementan las siguientes funciones:**
 
**frontend:**

* Para acceder a la aplicación, debe haber sido registrado previamente por el administrador. Si no recuerda su contraseña, puede recuperarla pulsando el botón recuperar contraseña, se le enviará un enlace de recuperación a su correo electrónico. El enlace es válido durante 30 minutos. 
* Al registrar un usuario, los campos obligatorios son: Nombre de usuario, Email y Contraseña. 
Estos campos no pueden estar vacíos. El campo Correo electrónico se comprobará si es realmente una dirección de correo electrónico. 
Requisitos de la contraseña: la longitud mínima es de 6 caracteres, la máxima de 20. Se muestran mensajes al usuario en caso de errores de introducción.  
* Cuando se edita un contacto, también se requiere el nombre del contacto, y también se comprueba el campo Email para ver si es una dirección de correo electrónico.  
El caso de introducir Email no es importante. No se permite el uso de dígitos en el nombre del contacto. 
* Al crear y editar eventos, el nombre del evento y el archivo de imagen son obligatorios. Si hace clic en una foto de la tabla de eventos,  
la foto se abrirá en un tamaño mayor. El nombre del evento no puede repetirse. 
Por defecto, un evento se crea con el estado nuevo, puedes verlo en la tabla. Si utiliza el evento y envía invitaciones con su participación, el estado cambia a utilizado. 
* En la tabla de envío de invitaciones puede seleccionar un nuevo evento por su nombre, luego seleccionar un contacto, uno o varios.  
Está disponible la ordenación por todos los campos, así como los filtros. También puede seleccionar un evento ya utilizado y enviar una invitación al contacto.  
También puede reenviar la invitación. Si no selecciona un evento y un contacto e intenta enviar una invitación, recibirá una notificación de error. A cada contacto se le enviará una invitación con su nombre, título del evento, foto, fecha y hora de inicio y dirección.  
Se espera que el contacto responda a este correo electrónico, hay 2 botones para esto: **sí asistiré** y **lo siento, pero no puedo.**  
Al hacer clic en cualquiera de ellos, se le mostrará una página sobre el éxito de la respuesta.
* En la tabla de respuestas, después de seleccionar el evento en el que se enviaron las invitaciones,  
puede ver todas las invitaciones enviadas a los contactos, el estado de envío y sus respuestas. 
* En el menú superior puedes acceder al botón refrescar, te permite refrescar todos los datos de la aplicación,  
no puedes ver los cambios de las respuestas de los contactos en tiempo real, necesitas refrescar la tabla de respuestas.  
* En el botón de perfil tienes acceso a: ver tu perfil, nombre de usuario y correo electrónico. Puedes cambiar estos campos como desees.  
Dispone de un botón para restablecer la contraseña, debe introducir su contraseña actual para cambiarla por una nueva. También puede eliminar su cuenta.  
* El administrador puede añadir un nuevo usuario y ver los usuarios existentes. El administrador también puede cambiar el nombre,  
el correo electrónico y la función del usuario. También puede eliminar un usuario. 
*Hay un campo de búsqueda bajo el menú superior. Permite buscar contactos y eventos por nombre.


**backend:**

**Descripción del Backend:**
* Basado en express framework para Node.js
* MongoDB alojado en la nube se utiliza como base de datos.
* El procesamiento intermedio de imágenes es utilizado por multer.
* Cloudinary se utiliza para almacenar imágenes.
* Para realizar las comprobaciones se utiliza el framework express-validator.
* Para la distribución de correo se utiliza nodemailer.
* Para el cifrado de contraseñas se utiliza bcrypt.
* Para desencriptar tokens se utiliza jsonwebtoken.
* Para generar enlaces únicos, se utiliza uuidv4.


**Se implementan las siguientes funciones:**
Para registrar un nuevo usuario (método POST), el nombre de usuario no puede estar vacío ni contener dígitos.
El campo de correo electrónico es obligatorio, compruebe la coincidencia de formato. Todos los caracteres se convierten a minúsculas. El nombre de usuario y el email son únicos y no pueden repetirse, si los datos se encuentran en la base de datos, se emite un mensaje al respecto.
El campo contraseña es obligatorio y debe contener un mínimo de 6 y un máximo de 20 caracteres. La contraseña se cifra con bcrypt. El registro sólo está disponible para el rol de administrador.
Al registrarse, se envía un correo electrónico a la dirección especificada con la contraseña del usuario.

Para el inicio de sesión del usuario, se utiliza el método POST, el caso del correo electrónico no es importante. Buscar en la base de datos por email. Si no existe tal usuario, se muestra un mensaje al respecto. Si la contraseña se introduce incorrectamente, se genera un mensaje. Si tiene éxito, se genera un token de cliente que contiene el id de usuario y el rol. En respuesta, se envían el token, el id y el nombre del usuario, y el rol del usuario.

La recuperación de una lista de usuarios (GET) está disponible para los usuarios con rol de administrador.

Recuperar datos de usuario por nombre de usuario (GET) está disponible, la función está disponible para usuarios autorizados.

La actualización de los datos de usuario (PUT) está disponible, la función está disponible para los usuarios autorizados. Se realizan las mismas comprobaciones que durante el registro. Los errores se comunican al cliente.

El cambio de contraseña de usuario está disponible (método POST), la función está disponible para los usuarios autorizados. El campo de la nueva contraseña es obligatorio y debe contener un mínimo de 6 y un máximo de 20 caracteres. Se envía un mensaje al cliente sobre los errores. Si el cambio se realiza correctamente, se envía un correo electrónico a la dirección del usuario con la nueva contraseña.

Función de restablecimiento de contraseña (método POST). El campo de correo electrónico es obligatorio, compruebe que el formato coincide. Cuando se encuentra un usuario en la base de datos, se genera un token y su hora de creación se registra en la colección del usuario. El tiempo de validez del token es de 30 minutos. Se envía un correo electrónico a la dirección del usuario con un enlace para introducir una nueva contraseña. El campo de nueva contraseña es obligatorio y debe contener un mínimo de 6 y un máximo de 20 caracteres.

Función de contraseña olvidada (método POST). El servidor espera una contraseña, debe contener al menos 6 y no más de 20 caracteres. El cliente envía a través de params, que recibe en el correo, su id, token. El servidor busca al usuario y comprueba su token. Si la verificación tiene éxito, la nueva contraseña se cifra y se almacena en la colección. Los datos sobre el token y su tiempo se borran. Se envía un correo electrónico a la dirección del usuario con su nueva contraseña.

Función de eliminación de un usuario (método DELETE). Se busca el id en la base de datos y se borra.

Creación de listas de correo (método POST). El servidor espera el id del evento y la matriz de id de contactos. Busca en la base de datos el evento y los datos del contacto, envía un email con los datos del evento, utilizando los datos del contacto, cambia la bandera de que la invitación ha sido enviada. Repite para cada contacto del array de contactos.

Método de envío por listas de correo ya creadas (método Patch). El servidor espera el id y el nombre del evento, la matriz de contactos id. Busca en la base de datos la lista de correo y los datos del contacto, envía un correo electrónico con los datos del evento, utilizando los datos del contacto, cambia el indicador de que la invitación ha sido enviada. Repite para cada contacto en el array de contactos. Devuelve al cliente un mensaje de éxito con el nombre del evento.

Recuperar la lista de contactos (GET), la función está disponible para los usuarios autorizados.

Función para gestionar las respuestas de los contactos (GET).  El servidor toma en params: id de evento, id de contacto y respuesta. Buscamos una colección de listas de correo, encontramos un contacto en ella y establecemos la respuesta. En la respuesta enviamos un archivo HTML con un mensaje de agradecimiento.

Recuperar la lista de eventos (GET), la función está disponible para los usuarios autorizados.
Crear una lista de eventos (método POST), la función está disponible para los usuarios autorizados. El nombre del evento no puede estar vacío, el archivo de imagen es obligatorio. Guardar la imagen en cloudinary, guardar el enlace en la colección de eventos.
Editar eventos, el método (PUT) sólo está disponible para usuarios autorizados. El nombre del evento no puede estar vacío.
Eliminar eventos (método DELETE), disponible para usuarios con rol de administrador.

Recuperar lista de contactos (GET), la función está disponible para usuarios autorizados.
Crear contacto (método POST), editar contacto (método PUT), función disponible para usuarios autorizados. El nombre y la dirección de correo electrónico del contacto son obligatorios.
Eliminar contacto (método DELETE), función disponible para usuarios con rol de administrador.

Recuperar directorio de campos de contacto (método GET), disponible para usuarios autorizados.
Crear directorio de campos de contacto (método Patch), editar directorio de contactos (método PUT), función disponible para usuarios autorizados. No se aceptan datos vacíos.
La función de eliminar campos de contacto (método DELETE), está disponible para usuarios con rol de administrador.

El servidor gestiona los errores emitiendo mensajes y los devuelve al cliente.
 

## Screenshots 📷

<img src="images/Captura de pantalla 2023-11-14 100425.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 100456.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104800.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104827.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104852.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104918.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104934.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 105034.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 104954.png" width="350" height="200"><img src="images/Captura de pantalla 2023-11-14 105051.png" width="350" height="200">
<img src="images/Captura de pantalla 2023-11-14 134638.png" width="350" height="200">
<img src="images/Captura de pantalla 2023-11-14 134705.png" width="350" height="200">
<img src="images/Diagramma fijo.jpg" width="350" height="400"><img src="images/Diagramma DB.png" width="350" height="200">
## Stacks 🖥️
● Microsoft Visual Studio 2022 <br>
● JavaScrypt <br>
● Node.js <br>
● Express.js <br>
● React <br>
● Material-UI <br>
● Postman <br>
● GitHub <br>
● Trello <br>

## Technologies and Tools 🔨
<a href="https://reactjs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/react-original-wordmark.svg" alt="React" height="50" /></a>  
<a href="https://www.javascript.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/javascript-original.svg" alt="JavaScript" height="50" /></a>  
<a href="https://mui.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/mui.png" alt="Material UI" height="50" /></a>  
<a href="https://www.figma.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/figma-icon.svg" alt="Figma" height="50" /></a>  
<a href="https://nodejs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="Node.js" height="50" /></a>  
<a href="https://www.mongodb.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" alt="MongoDB" height="50" /></a>  
<a href="https://github.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/git-scm-icon.svg" alt="Git" height="50" /></a>
<a href="https://cloud.google.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/google_cloud-icon.svg" alt="GCP" height="50" /></a> 
<a href="https://www.postman.com/" target="_blank"><img style="margin: 10px" src="https://cdn.coursehunter.net/category/postman.png" alt="Postman" height="50" /></a>  
</div>



## Installation Process ⬆️

1. Clone the GitHub repository: [p9-remitente-email](https://github.com/Slavafit/p9-remitente-email.git)
2. Open the file using Microsoft Visual Studio 2022.
3. en consola acceder a la carpeta del proyecto, npm install
4. en la carpeta Back-end npm start
5. en la carpeta Front-end npm run dev


## Next Steps 🔜
 

## Author 👨‍💻

| [<img src="https://avatars.githubusercontent.com/u/132560447?v=4" width=100><br><sub>Viacheslav Fitlin</sub>](https://github.com/Slavafit) |

