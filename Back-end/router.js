const Router = require('express')
const router = new Router()
const controller = require('./controller')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
     check('username', "username cannot be empty").notEmpty(),
     check('email', "email cannot be empty").notEmpty(),
     check('email', "not is email address").isEmail(),
     check ('password', "The password must be more than 4 and less than 20 characters")
     .isLength({min:4, max:20}, )
     ], roleMiddleware(['ADMIN']), controller.registration)
router.post('/login', controller.login)
router.post('/events', [
     check('name', "event cannot be empty").notEmpty(),
     ], authMiddleware, controller.createEvent)
router.post('/lists', [
     check('cargo', "No hay valores").notEmpty(),
     check('cargo', "No hay valores").isArray({ min: 1 })
     ], authMiddleware, controller.createList)
router.post('/contacts', [
     check('nombre', "Nombre no puede estar vacío").notEmpty(),
     check('nombre', 'Nombre no puede contener números').custom(value => {
          return !/\d/.test(value);
        }),
     check('email', "Email no puede estar vacío").notEmpty(),
     check('email', "Compruebe la email").isEmail(),
     ], authMiddleware, controller.createContact)
router.post('/maillists', [
     check('contacts', "contacts cannot be empty!").isArray({ min: 1 }),
     check('eventId', "Evento no puede estar vacío").notEmpty(),
     ], authMiddleware, controller.createMailList)


router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/personal', authMiddleware, controller.getUserByUsername)
router.get('/events', authMiddleware, controller.getEvents)
router.get('/lists', authMiddleware, controller.getLists)
router.get('/contacts', authMiddleware, controller.getContacts)
router.get('/maillists', authMiddleware, controller.getMailList)
router.get('/dashboard', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/response', controller.responseMailList)

router.put('/users', [
     check('username', "username cannot be empty").notEmpty(),
     check('email', "email cannot be empty").notEmpty(),
     check('email', "not is email address").isEmail(),
     ], roleMiddleware(['ADMIN','USER']), controller.updateUser)
router.put('/events', [
     check('name', "el nombre del evento no puede estar vacío").notEmpty(),
     ], authMiddleware, controller.updateEvent)
router.put('/contacts',[
     check('nombre', "nombre cannot be empty").notEmpty(),
     check('email', "email cannot be empty").notEmpty(),
     check('email', "not is email address").isEmail(),
     ], authMiddleware, controller.updateContact)
router.put('/lists', authMiddleware, controller.updateList)

router.patch('/lists', [
     check('cargo', "no hay valores").notEmpty(),
     check('provincia', "no hay valores").notEmpty(),
     check('entidad', "no hay valores").notEmpty(),
     check('categoria', "no hay valores").notEmpty(),
     check('territorio', "no hay valores").notEmpty(),
     ], authMiddleware, controller.patchList)
router.patch('/maillists', [
     check('contacts', "Los contactos no pueden estar vacíos").isArray({ min: 1 }),
     check('eventId', "Evento no puede estar vacío").notEmpty(),
     check('eventName', "Evento no puede estar vacío").notEmpty()
     ], authMiddleware, controller.patchMailList)

router.delete('/events/:id', roleMiddleware(['ADMIN']), controller.deleteEvent)
router.delete('/users', roleMiddleware(['ADMIN']), controller.deleteUser)
router.delete('/lists', roleMiddleware(['ADMIN']), controller.deleteListValues)
router.delete('/contacts/:id', roleMiddleware(['ADMIN']), controller.deleteContacts)



module.exports = router
