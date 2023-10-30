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
     ], controller.createEvent)

router.get('/users', controller.getUsers)
router.get('/events', controller.getEvents)
router.get('/dashboard', roleMiddleware(['ADMIN']), controller.getUsers)


// router.put('/users', roleMiddleware(['ADMIN','USER']), controller.updateUser)
router.put('/events', authMiddleware, controller.updateEvent)

router.delete('/events/:id', roleMiddleware(['ADMIN']), controller.deleteEvent)
router.delete('/users', roleMiddleware(['ADMIN']), controller.deleteUser)





module.exports = router
