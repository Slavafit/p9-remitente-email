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
     ], controller.registration) //вызываем функцию из контроллера authController
router.post('/login', controller.login)
router.post('/events', [
     check('name', "event cannot be empty").notEmpty()
     ], authMiddleware, controller.createEvent)
router.post('/lists', authMiddleware, controller.createList)
router.post('/contacts', authMiddleware, controller.createContact)


router.get('/users', authMiddleware, controller.getUsers)
router.get('/personal', authMiddleware, controller.getUserByUsername)
router.get('/events', authMiddleware, controller.getEvents)
router.get('/lists', authMiddleware, controller.getLists)
router.get('/contacts', authMiddleware, controller.getContacts)
router.get('/dashboard', roleMiddleware(['ADMIN']), controller.getUsers)


router.put('/users', roleMiddleware(['ADMIN','USER']), controller.updateUser)
router.put('/events', authMiddleware, controller.updateEvent)
router.put('/contacts', authMiddleware, controller.updateContact)
router.put('/lists', authMiddleware, controller.updateList)
router.patch('/lists', authMiddleware, controller.patchList)

router.delete('/events/:id', roleMiddleware(['ADMIN']), controller.deleteEvent)
router.delete('/users', roleMiddleware(['ADMIN']), controller.deleteUser)
router.delete('/lists', roleMiddleware(['ADMIN']), controller.deleteListValues)
router.delete('/contacts/:id', roleMiddleware(['ADMIN']), controller.deleteContacts)





module.exports = router
