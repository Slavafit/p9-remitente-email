const UserModel = require('./models/UserModel');
const RoleModel = require('./models/RoleModel');   //импорт модели
const EventModel = require('./models/EventModel');
const ContactModel = require('./models/ContactModel');
const ListModel = require('./models/ListModel');
const MailListModel = require('./models/MailListModel');
const mailer = require('./mailer');     //импорт настроек
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { uuid } = require('uuidv4');
const path = require('path');

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

    //регистрация пользователя
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
            // приведение email к нижнему регистру
            const lowerCaseEmail = email.toLowerCase();
            const candidate = await UserModel.findOne({ $or: [{ username }, { email: lowerCaseEmail }] });    //ищем пользователя в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `Usuario con ${username} or ${lowerCaseEmail} ya existe`});
            }
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            const userRole = await RoleModel.findOne({value: "USER"})    //ищем роль
            const user = new UserModel({username, email: lowerCaseEmail, password: hashPassword, roles: [userRole.value]})  //создаем пользователя
            await user.save()   //сохраняем в БД
            
            const mailMessage = {
                from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                to: `${lowerCaseEmail}`,
                subject: `Registrado exitosamente en nuestro sitio "Remitente de invitaciones."`,
                html: `
                <h2>Felicidades, ${username}! Estás registrado exitosamente en nuestro sitio!</h2>
                
                <i>información de su cuenta:</i>
                <ul>
                    <li>nombre de usuario: ${username}</li>
                    <li>correo electrónico: ${lowerCaseEmail}</li>
                    <li>contraseña: ${password}</li>
                </ul>
                
                <p>Esta carta no requiere respuesta.<p>`
            }
            mailer(mailMessage);
            return res.json({message: `Usuario ${username} ha sido registrado exitosamente`})  //вернули сообщение клиенту

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', error: e.message })
        }
    };
    //ввход пользователя
    async login(req, res) {
        try {
            const { email, password } = req.body   //получили данные от клиента
            // приведение email к нижнему регистру
            const lowerCaseEmail = email.toLowerCase();
            //ищем пользователя в базе
            const user = await UserModel.findOne({email: lowerCaseEmail })
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `El usuario con ${email} no existe`})
            }
            //расшифровываю пароль клиента при помощи compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Contraseña incorrecta introducida`})
            }
            //генерирую токен и отправляю клиенту
            const token = generateAccessToken(user._id, user.roles)
            const userData = {userId: user._id, username: user.username, role: user.roles[0]}
            return res.json({token, userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login errorError de inicio de sesión'})
        }
    };


    //получить список пользователей
    async getUsers(req, res) {
        try {
            // console.log("Received getUsers");
            const users = await UserModel.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
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
    };
    //Обработчик обновления пользователя
    async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const { _id } = req.query;
            const updatedUser = req.body; // обновленные данные из тела запроса
            // console.log(_id)
            // console.log(updatedUser)
            //Заменяем найденное новым объектом
            const user = await UserModel.findByIdAndUpdate(_id, updatedUser, { new: true });
            if (!user) {
                return res.status(404).json({ message: `Usuario no actualizado` });
            }
            res.json(user); // обновленные данные в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик для смены пароля
    async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const _id = req.params.id;
            const { oldPassword, newPassword } = req.body; // обновленные данные из тела запроса
            // console.log(_id)
            // console.log(oldPassword,newPassword)
            //ищем пользователя в базе
            const user = await UserModel.findById(_id)
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `Usuario no encontrado`})
            }
            const email = user.email;
            //расшифровываю пароль клиента при помощи compareSync
            const validPassword = bcrypt.compareSync(oldPassword, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Se ingresó una contraseña antigua incorrecta`})
            }

            const hashPassword = bcrypt.hashSync(newPassword, 7);  //захешировали пароль
            const updatedUser = await UserModel.findByIdAndUpdate(
                _id, 
                {password: hashPassword}, 
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: `User not updated` });
            }
            const mailMessage = {
                from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                to: `${email}`,
                subject: `Aviso de cambio de contraseña en el sitio web "Remitente de invitaciones"`,
                html: `
                <h2>Felicidades, has establecido una nueva contraseña</h2>
                
                <h4>Tu nueva contraseña: ${newPassword}</h4>
                
                <p>Esta carta no requiere respuesta.<p>`
            }
            mailer(mailMessage);

            res.json(updatedUser); // обновленные данные в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    // Обработчик для создания ссылки сброса пароля
    async forgotPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const { email } = req.body; // обновленные данные из тела запроса
            // console.log(email)
            //ищем пользователя в базе
            const user = await UserModel.findOne({email: email})
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `Usuario no encontrado`})
            }
            const token = uuid(); // генерируем случайный токен
            const expires = Date.now() + 1800000; // ссылка будет действительна в течение 0.5 часа
            user.resetPasswordToken = token;
            user.resetPasswordExpires = expires;
            await user.save();

            const link = `${process.env.APP_URL}/resetpassword/reset/${user._id}/${token}`;
            const mailMessage = {
                from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                to: `${user.email}`,
                subject: `Recuperar su contraseña en el sitio web "Remitente de invitaciones"`,
                html: `
                <h2>Usted u otra persona ha solicitado un restablecimiento de contraseña <br> para su dirección de correo electrónico.</h2>
                
                <h4>Sige este enlace para restablecer su contraseña: <a href="${link}">aquí</a></h4>
                <p>Periodo de validez: <b>30 minutos</b>.<p>

                <p>Si no fue Usted, simplemente ignore esta carta.<p>`
            }
            mailer(mailMessage);

            res.json({message:'El enlace se ha enviado a su correo electrónico'});
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик для смены пароля
    async resetPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const { id, token } = req.params;
            const { password } = req.body;
            // console.log("userId:",id,token,"password",password)
            //ищем пользователя в базе
            const user = await UserModel.findOne({
                _id: id, 
                resetPasswordToken: token, 
                resetPasswordExpires: { $gt: Date.now() } 
            });
            if (!user) {
              return res.status(400).json({ message: 'Token de reinicio no válido o caducado' });
            }    
                    //если не найден, то объект будет пустой и пойдет по условию ниже
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            await UserModel.findByIdAndUpdate(
                id, 
                {
                    password: hashPassword, 
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined
                },
                { new: true }
            );
            const mailMessage = {
                from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                to: `${user.email}`,
                subject: `Aviso de cambio de contraseña en el sitio web "Remitente de invitaciones"`,
                html: `
                <h2>Felicidades, Usted ha completado el procedimiento de restablecimiento de contraseña</h2>
                
                <h4>La nueva contraseña es: ${password}</h4>
                
                <p>Esta carta no requiere respuesta.<p>`
            }
            mailer(mailMessage);

            res.json({ message: 'Contraseña se ha restablecido' });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
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
    };


    // Обработчик создания записи в MailList
    async createMailList(req, res) {
        try {
            const { eventId, contacts, eventName } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = error.array().map(error => ({
            
                  message: error.msg,
                }));

                return res.status(400).json({errors: errorMessages });
            }

            const eventExists = await MailListModel.findOne({event: eventId}); // Проверка на существующее событие
                //   console.log("name",eventName,"id:",eventId);
            if (eventExists) {
                return res.status(400).json({ message: `Event already exists` });
            }
            
            const entries = contacts.map(contact => ({ contact }));
        
            // Создаем новую запись для модели MailList с заполненными entries
            const mailList = new MailListModel({ event: eventId, entries });

            // Обновляем флаг `used` в событии
            await EventModel.findByIdAndUpdate(eventId, { used: true });
        
            // Сохраняем запись в базу данных
            await mailList.save();
                
            // Отправляем сообщения электронной почты
            for (const contact of contacts) {
                const contactInfo = await ContactModel.findById(contact);
                const eventInfo = await EventModel.findById(eventId);
                const startDate = new Date(eventInfo.startDate);
                const formattedDate = startDate.toLocaleString();

                if (contactInfo) {
                    const link = `${process.env.APP_URL}/response/${eventId}/${contact}`;
                    const mailMessage = {
                        from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                        to: contactInfo.email,
                        subject: `Invitación a "${eventName}"`,
                        
                        html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <title>Invitación a "${eventName}"</title>
                        </head>
                        <body>
                        <h2>Estimido/a, ${contactInfo.nombre}! Nos gustaría informarle de que está invitado a una reunión.</h2>

                        <img src="${eventInfo.image}" alt="Evento" style="width: 200px; height: auto; margin-bottom: 10px;">
                        <p>Evento: ${eventName}</p>
                        <p>Descripción del evento: ${eventInfo.description}</p>
                        <i>información:</i>
                            <ul>
                                <li>Fecha y hora: ${formattedDate}</li>
                                <li>Localización: ${eventInfo.adress}</li>
                            </ul>
                        <p>Un saludo</p>

                        <p>Esta carta requiere su respuesta. Por favor, seleccione su respuesta.<p>
                        <a href="${link}/Voy" style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color: #fff; text-decoration: none; border-radius: 5px;">Si, voy.</a>
                        <a href="${link}/No puedo" style="display: inline-block; padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lo siento, no puedo.</a>
                        </body>
                        </html>
                        `,
                    };
                    mailer(mailMessage)
                    .then(info => {
                        // Обработка успешной отправки
                        console.log('Email sent: ', info);
                
                        // Обновление флага isSent в MailList
                        return MailListModel.findOneAndUpdate(
                            { event: eventId, 'entries.contact': contact },
                            { $set: { 'entries.$.isSent': true } }
                        );
                    })
                    .then(() => {
                        console.log('Flag isSent is true');
                    })
                    .catch(err => {
                        // Обработка ошибок
                        console.error('Error sending email: ', err);
                    });
                }
            }
            res.status(201).json({ message: `MailList con evento "${eventName}" creado exitosamente` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'createMailList error', message: error.message });
        }
    };
    //Обработчик добавления записей в MailList
    async patchMailList(req, res) {
        try {
            const { eventId, eventName, contacts  } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = error.array().map(error => ({
            
                  message: error.msg,
                }));

                return res.status(400).json({errors: errorMessages });
            }

            const mailList = await MailListModel.findOne({ event: eventId });

            if (!mailList) {
                return res.status(404).json({ message: `MailList not found for event ${eventId}` });
              }
              const existingContacts = mailList.entries.map(entry => entry.contact.toString()); // Получить существующие контакты в виде строк

              const newEntries = contacts
                .filter(contactId => !existingContacts.includes(contactId)) // Отфильтровать только те, которых еще нет в entries
                .map(contactId => ({ contact: contactId }));
              
              mailList.entries.push(...newEntries);
              await mailList.save();
            
            // Отправляем сообщения электронной почты
            for (const contact of contacts) {
                const contactInfo = await ContactModel.findById(contact);
                const eventInfo = await EventModel.findById(eventId);
                const startDate = new Date(eventInfo.startDate);
                const formattedDate = startDate.toLocaleString();

                if (contactInfo) {
                    const mailMessage = {
                        from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                        to: contactInfo.email,
                        subject: `Invitación a "${eventName}"`,
                        
                        html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <title>Invitación a "${eventName}"</title>
                        </head>
                        <body>
                        <h2>Estimido/a, ${contactInfo.nombre}! Nos gustaría informarle de que está invitado a una reunión.</h2>

                        <img src="${eventInfo.image}" alt="Evento" style="width: 200px; height: auto; margin-bottom: 10px;">
                        <p>Evento: ${eventName}</p>
                        <p>Descripción del evento: ${eventInfo.description}</p>
                        <i>información:</i>
                            <ul>
                                <li>Fecha y hora: ${formattedDate}</li>
                                <li>Localización: ${eventInfo.adress}</li>
                            </ul>
                        <p>Un saludo</p>

                        <p>Esta carta requiere su respuesta. Por favor, seleccione su respuesta.<p>
                        <a href="https://p9-remitente.oa.r.appspot.com/response/${eventId}/${contact}/Voy" style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color: #fff; text-decoration: none; border-radius: 5px;">Si, voy.</a>
                        <a href="https://p9-remitente.oa.r.appspot.com/response/${eventId}/${contact}/No puedo" style="display: inline-block; padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lo siento, no puedo.</a>
                        </body>
                        </html>
                        `,
                    };
                    mailer(mailMessage)
                        .then(info => {
                            // Обработка успешной отправки
                            // console.log('Email sent: ', info);
                    
                            // Обновление флага isSent в MailList
                            return MailListModel.findOneAndUpdate(
                                { event: eventId, 'entries.contact': contact },
                                { $set: { 'entries.$.isSent': true } }
                            );
                        })
                        .then(() => {
                            console.log('Flag isSent updated successfully');
                        })
                        .catch(err => {
                            // Обработка ошибок
                            console.error('Error sending email: ', err);
                        });
                }

            }
            res.status(201).json({ message: `MailList "${eventName}" actualizado correctamente` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'createMailList error', message: error.message });
        }
    };
    // Обработчик обновления записи MailList
    async updateMailList(req, res) {
        try {
            const { _id } = req.query;
            const { entries } = req.body;
        
            // Обновляем данные записи по _id
            const updatedMailList = await MailListModel.findByIdAndUpdate(_id, { entries }, { new: true });
        
            if (!updatedMailList) {
                return res.status(404).json({ message: 'MailList no encontrado' });
            }
        
            res.json(updatedMailList);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик получения mailList
    async getMailList(req, res) {
        try {
            // console.log("Received getMailList");
            const maillist = await MailListModel.find()
            res.json(maillist)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик получения ответов
    async responseMailList(req, res) {
        try {
            const { eventId, contactId, response } = req.params
            // console.log("Received responseMailList","eventId",eventId, "contactId",contactId, "response",response );

            const mailList = await MailListModel.findOne({event: eventId});
            if (!mailList) {
                return res.status(404).json({ message: 'MailList no encontrado' });
            }

            const foundEntry = mailList.entries.find(entry => entry.contact.toString() === contactId);
            if (foundEntry) {
                foundEntry.response = response;
          
                await mailList.save();
                // return res.json({ message: 'Respuesta actualizada correctamente' });
                const filePath = path.join(__dirname, 'views', 'welcome.html');
                return res.sendFile(filePath);

              } else {
                return res.status(404).json({ message: 'Contacto no encontrado' });
              }
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };




    // Обработчик получения event
    async getEvents(req, res) {
        try {
            const events = await EventModel.find()
            res.json(events)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик создания event
    async createEvent(req, res) {
        try {
            const eventData = req.body; // Данные из тела запроса
            // console.log(eventData);
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = error.array().map(error => ({
            
                  message: error.msg,
                }));

                return res.status(400).json({errors: errorMessages });
            }
            const candidate = await EventModel.findOne({ name: eventData.name })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `Evento ${eventData.name} ya existe`})
            }
                // Загружаем изображение в Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(eventData.image);
            const event = new EventModel({
                name: eventData.name,
                description: eventData.description,
                image: cloudinaryResult.url,
                startDate: eventData.startDate,
                adress: eventData.adress,
                used: false
            });

            await event.save()   //сохраняем в БД
            return res.json({message: `Evento ${eventData.name} guardado correctamente`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'PostEvent error', message: e.message})
        }
    };
    // Обработчик обновления event    
    async updateEvent(req, res) {
        try {
            const { _id } = req.query;
            const eventData = req.body; // обновленные данные  из тела запроса
            //Заменяем  новым объектом
            const event = await EventModel.findByIdAndUpdate(_id, eventData, { new: true });
            if (!event) {
                return res.status(400).json({ message: `Evento ${eventData.name} no actualizado` });
            }
            res.json(event); // Отправьте обновленные данные event в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик удаления event
    async deleteEvent(req, res) {
        const eventId = req.params.id;
        // console.log("Received deleteEvent request with Id:", eventId);
        try {
            const deletedEvent = await EventModel.findByIdAndDelete(eventId);
            if (!deletedEvent) {
              return res.status(404).json({ message: 'Evento no encontrado' });
            }
            res.json({ message: 'Evento borrado correctamente' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting event' });
          }
    };        
    
    
    // Обработчик получения Contact
    async getContacts(req, res) {
        try {
            const contacts = await ContactModel.find()
            res.json(contacts)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик создания Contact
    async createContact(req, res) {
        try {
            const contactData = req.body; // Данные из тела запроса
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = error.array().map(error => ({
            
                  message: error.msg,
                }));
    
                return res.status(400).json({errors: errorMessages });
            }
            // console.log("createContact",contactData);
            const candidate = await ContactModel.findOne({ email: contactData.email })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `Contacto con ${contactData.email} ya existe`})
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
            return res.json({message: `${contactData.nombre} con ${contactData.email} guardado correctamente.`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'createContact error', message: e.message})
        }
    };
    // Обработчик обновления Contact  
    async updateContact(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const { _id } = req.query;
            const сontactData = req.body; // обновленные данные  из тела запроса
            //Заменяем  новым объектом
            const сontact = await ContactModel.findByIdAndUpdate(_id, сontactData, { new: true });
            if (!сontact) {
                return res.status(400).json({ message: `Evento ${сontactData.nombre} no actualizado` });
            }
            res.json(сontact); // Отправьте обновленные данные event в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик удаления Contact
    async deleteContacts(req, res) {
        const contactId = req.params.id;
        console.log("Received deleteContacts request", contactId);
        try {
            const contact = await ContactModel.findByIdAndDelete(contactId); // Используйте _id напрямую
            if (!contact) {
                return res.status(404).json({ message: `Contacto no actualizado` });
            }
            res.json({ message: `Contacto eliminado correctamente` });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
    };


        
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
    };
    // Обработчик создания list
    async createList(req, res) {
            try {
                const { cargo, provincia, entidad, categoria, territorio } = req.body;
                // console.log("createList",cargo);
                const error = validationResult(req);
                if (!error.isEmpty()) {
                    // Если есть ошибки валидации
                    const errorMessages = error.array().map(error => ({
                
                      message: error.msg,
                    }));
    
                    return res.status(400).json({errors: errorMessages });
                }
                // Проверка переданных данных от клиента
                const data = { cargo, provincia, entidad, categoria, territorio };
                const validFields = Object.keys(data).filter(key => data[key]);

                if (validFields.length === 0) {
                    return res.status(400).json({ message: 'Se debe proporcionar al menos un campo' });
                }
                // Создаем новую запись
                const newList = new ListModel({});

                validFields.forEach(field => {
                newList[field] = data[field];
                });

                // Сохраняем запись в базу данных
                await newList.save();
                res.status(201).json({ message: 'Lista creada correctamente'});
            } catch (e) {
                console.log(e)
                res.status(500).json({error: 'PostList error', message: e.message})
            }
    };
    // Обработчик обновления list    
    async updateList(req, res) {
        try {
            const { _id, cargo, provincia, entidad, categoria, territorio } = req.body;
            const updatedFields = {};
            // console.log("updateList",_id,entidad);
            // Проверяем какие поля были отправлены и обновляем соответствующие массивы
            if (cargo) updatedFields.cargo = cargo;
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
                return res.status(404).json({ message: 'Lista  no encontrado' });
              }
          
              res.json(updatedList);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };
    // Обработчик частичного обновления значений массивов
    async patchList(req, res) {
        try {
        const { _id, cargo, provincia, entidad, categoria, territorio } = req.body;
        // console.log("patchList",_id,cargo);
        const error = validationResult(req);
        if (!error.isEmpty()) {
            // Если есть ошибки валидации
            const errorMessages = error.array().map(error => ({
        
              message: error.msg,
            }));

            return res.status(400).json({errors: errorMessages });
        }
        const updatedFields = {};
        let lastElement;
        
        if (cargo) {
          updatedFields.cargo = cargo;
          lastElement = cargo[cargo.length - 1];
        }
        if (provincia) {
          updatedFields.provincia = provincia;
          lastElement = provincia[provincia.length - 1];
        }
        if (entidad) {
          updatedFields.entidad = entidad;
          lastElement = entidad[entidad.length - 1];
        }
        if (categoria) {
          updatedFields.categoria = categoria;
          lastElement = categoria[categoria.length - 1];
        }
        if (territorio) {
          updatedFields.territorio = territorio;
          lastElement = territorio[territorio.length - 1];
        }
    
        const updatedList = await ListModel.findByIdAndUpdate(
            _id,
            { $addToSet: updatedFields }, // Используем $addToSet для добавления значений в массивы
            { new: true }
        );
    
        if (!updatedList) {
            return res.status(404).json({ message: 'Lista no encontrado' });
        }
        res.json({ message: `Nuevo valor ${lastElement} agregado exitosamente`});
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    };

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
            return res.status(404).json({ message: 'Lista no encontrado' });
          }
      
          res.json(updatedList);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
    };
      
}

module.exports = new controller()
