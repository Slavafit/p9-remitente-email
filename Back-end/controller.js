const UserModel = require('./models/UserModel');
const RoleModel = require('./models/RoleModel');   //импорт модели
const EventModel = require('./models/EventModel');
const ContactModel = require('./models/ContactModel');
const mailer = require('./mailer');     //импорт настроек
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
// const {secret} = require('./config')
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "24h"})
} 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

class controller {


    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const {username, email, password } = req.body;
            const candidate = await UserModel.findOne({ $or: [{ username }, { email }] });    //ищем пользователя в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `User with ${username} or ${email} already exists`});
            }
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            const userRole = await RoleModel.findOne({value: "USER"})    //ищем роль
            const user = new UserModel({username, email, password: hashPassword, roles: [userRole.value]})  //создаем пользователя
            await user.save()   //сохраняем в БД
            
            const mailMessage = {
                from: 'Cloud Music, slavafit@mail.ru',
                to: `${email}`,
                subject: `Successfully registred on our site`,
                html: `
                <h2>Congratulations, ${username}! You are successfully registred on our site!</h2>
                
                <i>your account information:</i>
                <ul>
                    <li>username: ${username}</li>
                    <li>email: ${email}</li>
                    <li>password: ${password}</li>
                </ul>
                
                <p>This letter does not require a reply.<p>`
            }
            mailer(mailMessage);
            return res.json({message: `User ${username} has been successfully registered`})  //вернули сообщение клиенту

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', error: e.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body   //получили данные от клиента
            //ищем пользователя в базе
            const user = await UserModel.findOne({email})
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `User with ${email} not found`})
            }
            //расшифровываю пароль клиента при помощи compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Incorrect password entered`})
            }
            //генерирую токен и отправляю клиенту
            const token = generateAccessToken(user._id, user.roles)
            const userData = {userId: user._id, username: user.username, role: user.roles[0]}
            return res.json({token, userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }


   
    // Обработчик для удаления User по Id
    async deleteUser(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            // console.log("Received deleteUser request with Id:", _id);
            const user = await UserModel.findById(_id); // Используйте _id напрямую
            if (!user) {
                return res.status(404).json({ message: `User with ${_id} not found` });
            }
            // Если user найден, удаляем
            // console.log("User Id: ", _id, " deleted");
            await user.deleteOne({_id});
        
            return res.json({ message: `User with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getEvents(req, res) {
        try {
            const events = await EventModel.find()
            res.json(events)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обработчик создания event
    // async createEvent(req, res) {
    //     try {
    //         const eventData = req.body; // Данные из тела запроса
    //         // console.log(eventData);
    //         const candidate = await EventModel.findOne({ name: eventData.name })    //ищем данные в БД
    //         if (candidate) {        //если нашли вернули сообщение
    //             return res.status(400).json({message: `Event ${eventData.name} already exists`})
    //         }
    //         const event = new EventModel({
    //             name: eventData.name,
    //             description: eventData.description,
    //             image: { data: Buffer.from(eventData.image, 'base64'), contentType: 'image/png' },
    //             startDate: eventData.startDate,
    //             endDate: eventData.endDate
    //         });
    async createEvent(req, res) {
        try {
            const eventData = req.body; // Данные из тела запроса
            // console.log(eventData);
            const candidate = await EventModel.findOne({ name: eventData.name })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `Event ${eventData.name} already exists`})
            }
                // Загружаем изображение в Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(eventData.image);
            const event = new EventModel({
                name: eventData.name,
                description: eventData.description,
                image: cloudinaryResult.url,
                startDate: eventData.startDate,
                endDate: eventData.endDate
            });

            await event.save()   //сохраняем в БД
            return res.json({message: `Event ${eventData.name} successfully saved`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'PostEvent error', message: e.message})
        }
    }
        
    async updateEvent(req, res) {
        try {
            const { eventData } = req.body; // обновленные данные  из тела запроса
            //Заменяем найденую песню новым объектом
            const candidate = await EventModel.findOne( eventData.name);
            if (!candidate) {
                return res.status(400).json({ message: `Event ${eventData.name} already exists` });
            }
            const newEvent = new EventModel({
                name, 
                description, 
                image: { data: Buffer.from(imageData, 'base64'), contentType: 'image/png' }, 
                startDate, 
                endDate})  //создаем event
            await newEvent.save()   //сохраняем в БД

            res.json(newEvent); // Отправьте обновленные данные event в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

        // Обработчик для удаления event по ID
    async deleteEvent(req, res) {
        const eventId = req.params.id;
        // console.log("Received deleteEvent request with Id:", eventId);
        try {
            const deletedEvent = await EventModel.findByIdAndDelete(eventId);
            if (!deletedEvent) {
              return res.status(404).json({ message: 'Event not found' });
            }
            res.json({ message: 'Event deleted successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting event' });
          }
        }            
 
}

module.exports = new controller()
