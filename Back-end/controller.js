const UserModel = require('./models/UserModel');
const RoleModel = require('./models/RoleModel');   //импорт модели
const EventModel = require('./models/EventModel');
const ContactModel = require('./models/ContactModel');
const ListModel = require('./models/ListModel');
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
            // console.log("Received getUsers");
            const users = await UserModel.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserByUsername(req, res) {
        try {
            const { username } = req.query;
            // console.log("Received getUserByUsername request with:", username);
            const user = await UserModel.findOne({username});    
            if (!user) {
                return res.status(404).json({message: `User with ${username} not found`})
            }
            //const users = await User.find()
            return res.json({user})
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { _id } = req.query;
            const updatedUser = req.body; // обновленные данные из тела запроса
            // console.log(_id)
            // console.log(updatedUser)
            //Заменяем найденное новым объектом
            const user = await UserModel.findByIdAndUpdate(_id, updatedUser, { new: true });
            if (!user) {
                return res.status(404).json({ message: `User not updated` });
            }
            res.json(user); // обновленные данные в ответе
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



    // Обработчик получения event
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
    // Обработчик обновления event    
    async updateEvent(req, res) {
        try {
            const { _id } = req.query;
            const eventData = req.body; // обновленные данные  из тела запроса
            //Заменяем  новым объектом
            const event = await EventModel.findByIdAndUpdate(_id, eventData, { new: true });
            if (!event) {
                return res.status(400).json({ message: `Event ${eventData.name} not updated` });
            }
            res.json(event); // Отправьте обновленные данные event в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик удаления event
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
    
    
    // Обработчик получения Contact
    async getContacts(req, res) {
        try {
            const contacts = await ContactModel.find()
            res.json(contacts)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик создания Contact
    async createContact(req, res) {
        try {
            const contactData = req.body; // Данные из тела запроса
            console.log("createContact",contactData);
            const candidate = await ContactModel.findOne({ email: contactData.email })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `Contact with ${contactData.email} already exists`})
            }
            const contact = new ContactModel({
                nombre: contactData.nombre,
                cargo: contactData.cargo,
                entidad: contactData.entidad,
                categoria: contactData.categoria,
                provincia: contactData.provincia,
                territorio: contactData.territorio,
                email: contactData.email,
                telefono: contactData.telefono
            });

            await contact.save()   //сохраняем в БД
            return res.json({message: `${contactData.nombre} with ${contactData.email} successfully saved`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'createContact error', message: e.message})
        }
    }
    // Обработчик обновления Contact    
    async updateContact(req, res) {
        try {
            const { _id } = req.query;
            const сontactData = req.body; // обновленные данные  из тела запроса
            //Заменяем  новым объектом
            const сontact = await ContactModel.findByIdAndUpdate(_id, сontactData, { new: true });
            if (!сontact) {
                return res.status(400).json({ message: `Event ${сontactData.nombre} not updated` });
            }
            res.json(сontact); // Отправьте обновленные данные event в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик удаления Contact
    async deleteContacts(req, res) {
        const contactId = req.params.id;
        console.log("Received deleteContacts request", contactId);
        try {
            const contact = await ContactModel.findByIdAndDelete(contactId); // Используйте _id напрямую
            if (!contact) {
                return res.status(404).json({ message: `Contact not found` });
            }
            res.json({ message: `Contact was deleted successfully` });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }


        
    // Обработчик получения list
    async getLists(req, res) {
        try {
            const lists = await ListModel.find()
                  // Проверка: если коллекция пуста
            if (!lists || lists.length === 0) {
                return res.status(404).json({ message: 'No lists found' });
            }
            res.status(200).json( lists );
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик создания list
    async createList(req, res) {
            try {
                const { provincia, entidad, categoria, territorio } = req.body;
                // console.log("createList");
                // Проверка переданных данных от клиента
                const data = { provincia, entidad, categoria, territorio };
                const validFields = Object.keys(data).filter(key => data[key]);

                if (validFields.length === 0) {
                    return res.status(400).json({ message: 'At least one field must be provided' });
                }
                // Создаем новую запись
                const newList = new ListModel({});

                validFields.forEach(field => {
                newList[field] = data[field];
                });

                // Сохраняем запись в базу данных
                await newList.save();
                res.status(201).json({ message: 'List created successfully'});
            } catch (e) {
                console.log(e)
                res.status(500).json({error: 'PostList error', message: e.message})
            }
    }
    // Обработчик обновления list    
    async updateList(req, res) {
        try {
            const { _id, provincia, entidad, categoria, territorio } = req.body;
            const updatedFields = {};
            // console.log("updateList",_id,entidad);
            // Проверяем какие поля были отправлены и обновляем соответствующие массивы
            if (provincia) updatedFields.provincia = provincia;
            if (entidad) updatedFields.entidad = entidad;
            if (categoria) updatedFields.categoria = categoria;
            if (territorio) updatedFields.territorio = territorio;

            const updatedList = await ListModel.findByIdAndUpdate(
                _id,
                { $set: updatedFields },
                { new: true }
              );
          
              if (!updatedList) {
                return res.status(404).json({ message: 'List not found' });
              }
          
              res.json(updatedList);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик частичного обновления значений массивов
    async patchList(req, res) {
        try {
        const { _id, provincia, entidad, categoria, territorio } = req.body;
        // console.log("patchList",_id,entidad);
        const updatedFields = {};
        
        if (provincia) updatedFields.provincia = provincia;
        if (entidad) updatedFields.entidad = entidad;
        if (categoria) updatedFields.categoria = categoria;
        if (territorio) updatedFields.territorio = territorio;
    
        const updatedList = await ListModel.findByIdAndUpdate(
            _id,
            { $addToSet: updatedFields }, // Используем $addToSet для добавления значений в массивы
            { new: true }
        );
    
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
    
        res.json({ message: 'successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик удаления list
    async deleteListValues(req, res) {
        const { _id, provincia, entidad, categoria, territorio } = req.body;
        console.log("Received deleteListValues request", _id);
        try {
          const updateQuery = {};
      
          if (provincia) updateQuery.provincia = { $pull: { $in: provincia } };
          if (entidad) updateQuery.entidad = { $pull: { $in: entidad } };
          if (categoria) updateQuery.categoria = { $pull: { $in: categoria } };
          if (territorio) updateQuery.territorio = { $pull: { $in: territorio } };
      
          const updatedList = await ListModel.findByIdAndUpdate(
            _id,
            {
              $pull: updateQuery // Используем $pull без $in для удаления элементов
            },
            { new: true }
          );
      
          if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
          }
      
          res.json(updatedList);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }
      
}

module.exports = new controller()
