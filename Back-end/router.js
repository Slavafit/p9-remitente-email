const Router = require('express')
const router = new Router()
const controller = require('./controller')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')


const validateArray = (value) => {
     // Проверка наличия значений и отсутствия пустых строк в массиве
     if (!value || !Array.isArray(value) || value.length === 0 || value.some(item => typeof item !== 'string' || item.trim() === '')) {
       throw new Error('No hay valores');
     }
   
     return true;
   };

router.post('/registration', [
     check('username', "Nombre de usuario no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacía.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     check ('password', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], roleMiddleware(['ADMIN']), controller.registration)
router.post('/login', controller.login)
router.post('/changepassword/:id', [
     check('oldPassword', "La contraseña anterior está vacía.").notEmpty(),
     check('newPassword', "La nueva contraseña no puede estar vacía.").notEmpty(),
     check ('newPassword', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], controller.changePassword)
router.post('/resetpassword/forgot', [
     check('email', "Email no puede estar vacío").notEmpty(),
     check('email', "No es un correo electrónico.").isEmail(),
     ], controller.forgotPassword)
router.post('/resetpassword/reset/:id/:token', [
     check('password', "La nueva contraseña no puede estar vacía").notEmpty(),
     check ('password', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], controller.resetPassword)
router.post('/events', [
     check('name', "Nombre de evento no puede estar vacía.").notEmpty(),
     ], authMiddleware, controller.createEvent)
router.post('/lists', [
     check('cargo', "No hay valores").notEmpty(),
     check('entidad', "No hay valores").notEmpty(),
     check('categoria', "No hay valores").notEmpty(),
     check('provincia', "No hay valores").notEmpty(),
     check('territorio', "No hay valores").notEmpty(),
     ], authMiddleware, controller.createList)
router.post('/contacts', [
     check('nombre', "Nombre no puede estar vacío").notEmpty(),
     check('nombre', 'Nombre no puede contener números').custom(value => {
          return !/\d/.test(value);}),
     check('email', "Email no puede estar vacío.").notEmpty(),
     check('email', "Compruebe la email").isEmail(),
     ], authMiddleware, controller.createContact)
router.post('/maillists', [
     check('eventId', "Seleccione un evento").notEmpty(),
     check('contacts', "Seleccione uno o más contactos").isArray({ min: 1 })
     ], authMiddleware, controller.createMailList)


router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/personal', authMiddleware, controller.getUserByUsername)
router.get('/events', authMiddleware, controller.getEvents)
router.get('/lists', authMiddleware, controller.getLists)
router.get('/contacts', authMiddleware, controller.getContacts)
router.get('/maillists', authMiddleware, controller.getMailList) 
router.get('/dashboard', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/response/:eventId/:contactId/:response', controller.responseMailList)

router.put('/users', [
     check('username', "Nombre de usuario no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacío.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     ], authMiddleware, controller.updateUser)
router.put('/events', [
     check('name', "El nombre del evento no puede estar vacío").notEmpty(),
     ], authMiddleware, controller.updateEvent)
router.put('/contacts',[
     check('nombre', "Nombre de contacto no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacía.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     ], authMiddleware, controller.updateContact)
router.put('/lists', authMiddleware, controller.updateList)

router.patch('/lists', [
     check('cargo', "no hay valores").optional().custom(validateArray),
     check('provincia', "no hay valores").optional().custom(validateArray),
     check('entidad', "no hay valores").optional().custom(validateArray),
     check('categoria', "no hay valores").optional().custom(validateArray),
     check('territorio', "no hay valores").optional().custom(validateArray),
   ], authMiddleware, controller.patchList)
   
router.patch('/maillists', [
     check('contacts', "Seleccione uno o más contactos").isArray({ min: 1 }),
     check('eventId', "Seleccione uno o más contactos").notEmpty(),
     check('eventName', "Evento no puede estar vacío").notEmpty()
     ], authMiddleware, controller.patchMailList)

router.delete('/events/:id', roleMiddleware(['ADMIN']), controller.deleteEvent)
router.delete('/users', roleMiddleware(['ADMIN']), controller.deleteUser)
router.delete('/lists', roleMiddleware(['ADMIN']), controller.deleteListValues)
router.delete('/contacts/:id', roleMiddleware(['ADMIN']), controller.deleteContacts)



module.exports = router
