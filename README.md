# p9-remitente-email 

Proyecto 9 Bootcamp. Full Stack. Aplicación para el envío de invitaciones a contactos con sus respuestas. 

	Para acceder a la aplicación, debe haber sido registrado previamente por el administrador. Si no recuerda su contraseña,  

puede recuperarla pulsando el botón recuperar contraseña, se le enviará un enlace de recuperación a su correo electrónico. El enlace es válido durante 30 minutos. 

	Al registrar un usuario, los campos obligatorios son: Nombre de usuario, Email y Contraseña. 

	Estos campos no pueden estar vacíos. El campo Correo electrónico se comprobará si es realmente una dirección de correo electrónico. 

Requisitos de la contraseña: la longitud mínima es de 6 caracteres, la máxima de 20. Se muestran mensajes al usuario en caso de errores de introducción.  

	Cuando se edita un contacto, también se requiere el nombre del contacto, y también se comprueba el campo Email para ver si es una dirección de correo electrónico.  

El caso de introducir Email no es importante. No se permite el uso de dígitos en el nombre del contacto. 

	Al crear y editar eventos, el nombre del evento y el archivo de imagen son obligatorios. Si hace clic en una foto de la tabla de eventos,  

la foto se abrirá en un tamaño mayor. El nombre del evento no puede repetirse. 

Por defecto, un evento se crea con el estado nuevo, puedes verlo en la tabla. Si utiliza el evento y envía invitaciones con su participación, el estado cambia a utilizado. 

	En la tabla de envío de invitaciones puede seleccionar un nuevo evento por su nombre, luego seleccionar un contacto, uno o varios.  

Está disponible la ordenación por todos los campos, así como los filtros. También puede seleccionar un evento ya utilizado y enviar una invitación al contacto.  

También puede reenviar la invitación. Si no selecciona un evento y un contacto e intenta enviar una invitación, recibirá una notificación de error. A cada contacto se le enviará una invitación con su nombre, título del evento, foto, fecha y hora de inicio y dirección.  

Se espera que el contacto responda a este correo electrónico, hay 2 botones para esto: sí asistiré y lo siento pero no puedo.  

Al hacer clic en cualquiera de ellos, se le mostrará una página sobre el éxito de la respuesta.  

	En la tabla de respuestas, después de seleccionar el evento en el que se enviaron las invitaciones,  

puede ver todas las invitaciones enviadas a los contactos, el estado de envío y sus respuestas. 

	En el menú superior puedes acceder al botón refrescar, te permite refrescar todos los datos de la aplicación,  

no puedes ver los cambios de las respuestas de los contactos en tiempo real, necesitas refrescar la tabla de respuestas.  

En el botón de perfil tienes acceso a: ver tu perfil, nombre de usuario y correo electrónico. Puedes cambiar estos campos como desees.  

Dispone de un botón para restablecer la contraseña, debe introducir su contraseña actual para cambiarla por una nueva. También puede eliminar su cuenta.  

El administrador puede añadir un nuevo usuario y ver los usuarios existentes. El administrador también puede cambiar el nombre,  

el correo electrónico y la función del usuario. También puede eliminar un usuario. 

	Hay un campo de búsqueda bajo el menú superior. Permite buscar contactos y eventos por nombre. 


<p align="center">
  <img src="Images/Logo.png" width="250" height="250">
</p>


## Project Description 🚀

Cloud Music es una aplicación para escuchar música. En la página principal puedes buscar y escuchar la canción que has encontrado. Al registrarse el usuario recibirá información sobre su nombre de usuario y contraseña, no la pierda. Los usuarios registrados pueden crear sus propias listas, también pueden añadir sus canciones favoritas a estas listas. En su gabinete personal puede modificar sus datos personales o eliminar su cuenta. También puede editar y borrar sus listas de canciones.

Se implementan las siguientes funciones:
frontend:
hacer página de login.
hacer página de registro.
hacer comprobaciones del lado del cliente en la página de inicio de sesión.
hacer comprobaciones del lado del cliente en la página de registro
página de aplicación.
página de perfil y administración
añadir funciones de registro de usuarios
añadir la posibilidad de añadir, editar y borrar canciones para el administrador.
diferentes géneros disponibles
utilizar Backdrop durante la descarga
disponibilidad de botones de control del reproductor.
al pasar el cursor por encima de los botones, aparece información sobre herramientas
posibilidad de ver el nombre del artista y el título de la pista.
visualización del tiempo de pista y del progreso de la reproducción.
implementación de las funciones de reproducción de una pista y reproducción aleatoria.
visualización de mensajes informativos: al registrarse, al introducir datos incorrectos en la página de inicio de sesión, al cambiar los datos de usuario.
Función de búsqueda de canciones por artista y nombre de pista.
posibilidad de escuchar una canción a partir de la búsqueda.
posibilidad de crear, modificar y eliminar su lista
posibilidad de añadir canciones a su lista.
responsabilidad de la página
cambio de tema: oscuro y claro
en la ventana de búsqueda están disponibles las respuestas del servidor, en caso de que no se encuentre la canción deseada o el usuario haya realizado una petición vacía.

backend:
utilizado por los controles al registrar usuarios.
están disponibles diferentes roles de usuario.
se utiliza token
envío de notificación al usuario en caso de registro exitoso a su correo electrónico.
funciones implementadas de recepción, adición, edición y eliminación (CRUD): usuarios, canciones, listas de canciones.
se muestra la información relevante para el usuario. 
el usuario no puede ver la información de otros usuarios.
función para buscar canciones por artista y nombre de pista.
se realizan respuestas del servidor en caso de acciones erróneas del cliente.

## Screenshots 📷

<img src="Images/Captura de pantalla 2023-10-19 200329.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 200349.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 200411.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 200428.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 200518.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 200801.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 201734.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 203357.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 203416.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 203513.png" width="350" height="200"><img src="Images/Captura de pantalla 2023-10-19 203546.png" width="350" height="200">


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
<div align="center">  
<a href="https://reactjs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/react-original-wordmark.svg" alt="React" height="50" /></a>  
<a href="https://www.javascript.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/javascript-original.svg" alt="JavaScript" height="50" /></a>  
<a href="https://mui.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/mui.png" alt="Material UI" height="50" /></a>  
<a href="https://www.figma.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/figma-icon.svg" alt="Figma" height="50" /></a>  
<a href="https://nodejs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="Node.js" height="50" /></a>  
<a href="https://www.mongodb.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/mongodb-original-wordmark.svg" alt="MongoDB" height="50" /></a>  
<a href="https://github.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/git-scm-icon.svg" alt="Git" height="50" /></a>  
<a href="https://www.postman.com/" target="_blank"><img style="margin: 10px" src="https://cdn.coursehunter.net/category/postman.png" alt="Postman" height="50" /></a>  
</div>



## Installation Process ⬆️

1. Clone the GitHub repository: https://github.com/Slavafit/P8-react-player.git
2. Open the file using Microsoft Visual Studio 2022.
3. en consola acceder a la carpeta del proyecto, npm install
4. en la carpeta Back-end npm start
5. en la carpeta Front-end npm run dev


## Next Steps 🔜
 

## Author 👨‍💻

| [<img src="https://avatars.githubusercontent.com/u/132560447?v=4" width=100><br><sub>Viacheslav Fitlin</sub>](https://github.com/Slavafit) |

