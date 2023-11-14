# p9-remitente-email
Proyecto 9 Bootcamp. Full Stack. Aplicación para el envío de invitaciones a contactos con sus respuestas.

	Para acceder a la aplicación, debe haber sido registrado previamente por el administrador. Si no recuerda su contraseña, puede recuperarla pulsando el botón recuperar contraseña, se le enviará un enlace de recuperación a su correo electrónico. El enlace es válido durante 30 minutos.
	Al registrar un usuario, los campos obligatorios son: Nombre de usuario, Email y Contraseña. 
Estos campos no pueden estar vacíos. El campo Correo electrónico se comprobará si es realmente una dirección de correo electrónico.
Requisitos de la contraseña: la longitud mínima es de 6 caracteres, la máxima de 20. Se muestran mensajes al usuario en caso de errores de introducción.

	Cuando se edita un contacto, también se requiere el nombre del contacto, y también se comprueba el campo Email para ver si es una dirección de correo electrónico. 
 El caso de introducir Email no es importante. No se permite el uso de dígitos en el nombre del contacto.
	Al crear y editar eventos, el nombre del evento y el archivo de imagen son obligatorios. Si hace clic en una foto de la tabla de eventos, 
 la foto se abrirá en un tamaño mayor. El nombre del evento no puede repetirse.
Por defecto, un evento se crea con el estado nuevo, puedes verlo en la tabla. Si utiliza el evento y envía invitaciones con su participación, 
el estado cambia a utilizado.
	En la tabla de envío de invitaciones puede seleccionar un nuevo evento por su nombre, luego seleccionar un contacto, uno o varios. 
 Está disponible la ordenación por todos los campos, así como los filtros. También puede seleccionar un evento ya utilizado y enviar una invitación al contacto. 
 También puede reenviar la invitación. Si no selecciona un evento y un contacto e intenta enviar una invitación, recibirá una notificación de error. 
 A cada contacto se le enviará una invitación con su nombre, título del evento, foto, fecha y hora de inicio y dirección. 
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

