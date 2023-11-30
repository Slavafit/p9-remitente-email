const Router = require('express')
const router = new Router()
const controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const contactController = require('../controllers/contactController')
const listService = require('../service/listService')
const eventController = require('../controllers/eventController')
const {check} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/registration', [
     check('username', "Nombre de usuario no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacía.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     check ('password', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], roleMiddleware(['ADMIN']), userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/changepassword/:id', [
     check('oldPassword', "La contraseña anterior está vacía").notEmpty(),
     check('newPassword', "La nueva contraseña no puede estar vacía").notEmpty(),
     check ('newPassword', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], userController.changePassword)
router.post('/resetpassword/forgot', [
     check('email', "Email no puede estar vacío").notEmpty(),
     check('email', "No es un correo electrónico.").isEmail(),
     ], userController.forgotPassword)
router.post('/resetpassword/reset/:id/:token', [
     check('password', "La nueva contraseña no puede estar vacía").notEmpty(),
     check ('password', "La contraseña debe tener más de 6 y menos de 20 caracteres.")
     .isLength({min:6, max:20}, )
     ], userController.resetPassword)
router.post('/events', [
     check('name', "Nombre de evento no puede estar vacía.").notEmpty(),
     ], authMiddleware, eventController.createEvent)
router.post('/lists', [
     check('cargo', "No hay valores").notEmpty(),
     check('entidad', "No hay valores").notEmpty(),
     check('categoria', "No hay valores").notEmpty(),
     check('provincia', "No hay valores").notEmpty(),
     check('territorio', "No hay valores").notEmpty(),
     ], authMiddleware, listService.createList)
router.post('/contacts', [
     check('nombre', "Nombre no puede estar vacío").notEmpty(),
     check('nombre', 'Nombre no puede contener números').custom(value => {
          return !/\d/.test(value);}),
     check('email', "Email no puede estar vacío.").notEmpty(),
     check('email', "Compruebe la email").isEmail(),
     ], authMiddleware, contactController.createContact)
router.post('/maillists', [
     check('eventId', "Seleccione un evento").notEmpty(),
     check('contacts', "Seleccione uno o más contactos").isArray({ min: 1 })
     ], authMiddleware, controller.createMailList)


router.get('/users', roleMiddleware(['ADMIN']), userController.getUsers)
router.get('/activation/:activationLink', userController.aсtivateUser)
router.get('/refresh', userController.refreshToken)
router.get('/personal/:username', authMiddleware, userController.getUserByUserName)
router.get('/events', authMiddleware, eventController.getEvents)
router.get('/lists', authMiddleware, listService.getLists)
router.get('/contacts', authMiddleware, contactController.getContacts)
router.get('/maillists', authMiddleware, controller.getMailList) 
router.get('/response/:eventId/:contactId/:response', controller.responseMailList)

router.put('/users/:id', [
     check('username', "Nombre de usuario no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacío.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     ], roleMiddleware(['ADMIN','USER']), userController.updateUser)
router.put('/events/:id', [
     check('name', "El nombre del evento no puede estar vacío").notEmpty(),
     ], authMiddleware, eventController.updateEvent)
router.put('/contacts/:id',[
     check('nombre', "Nombre de contacto no puede estar vacía.").notEmpty(),
     check('email', "Email no puede estar vacía.").notEmpty(),
     check('email', "No es la dirección de correo electrónico.").isEmail(),
     ], authMiddleware, contactController.updateContact)
router.put('/lists', authMiddleware, listService.updateList)

router.patch('/lists', [
     check('cargo', "no hay valores").optional().isArray({ min: 1 }),
     check('provincia', "no hay valores").optional().isArray({ min: 1 }),
     check('entidad', "no hay valores").optional().isArray({ min: 1 }),
     check('categoria', "no hay valores").optional().isArray({ min: 1 }),
     check('territorio', "no hay valores").optional().isArray({ min: 1 }),
   ], authMiddleware, listService.patchList)
   
router.patch('/maillists', [
     check('eventId', "Seleccione un evento").notEmpty(),
     check('eventName', "Evento no puede estar vacío").notEmpty(),
     check('contacts', "Seleccione uno o más contactos").isArray({ min: 1 })
     ], authMiddleware, controller.patchMailList)

router.delete('/events/:id', roleMiddleware(['ADMIN']), eventController.deleteEvent)
router.delete('/users/:id', roleMiddleware(['ADMIN']), userController.deleteUser)
router.delete('/lists', roleMiddleware(['ADMIN']), listService.deleteListValues)
router.delete('/contacts/:id', roleMiddleware(['ADMIN']), contactController.deleteContact)

module.exports = router
