const EventModel = require('../models/EventModel');
const ContactModel = require('../models/ContactModel');
const MailListModel = require('../models/MailListModel');
const mailService = require('../service/mailService');     //импорт настроек
const { validationResult } = require('express-validator')
require('dotenv').config();
const path = require('path');

class controller {

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
                const options = {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  };
                const formattedDate = startDate.toLocaleString('DE', options);

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
                        <a href="${link}/Confirma asistencia" style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color: #fff; text-decoration: none; border-radius: 5px;">Confirma asistencia</a>
                        <a href="${link}/Confirma NO asistencia" style="display: inline-block; padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Confirma NO asistencia</a>
                        </body>
                        </html>
                        `,
                    };
                    mailService(mailMessage)
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
                const options = {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  };
                const formattedDate = startDate.toLocaleString('DE', options);

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
                        <a href="${link}/Confirma asistencia" style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color: #fff; text-decoration: none; border-radius: 5px;">Confirma asistencia</a>
                        <a href="${link}/Confirma NO asistencia" style="display: inline-block; padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Confirma NO asistencia</a>
                        </body>
                        </html>
                        `,
                    };
                    mailService(mailMessage)
                        .then(info => {
                            // Обработка успешной отправки
                                                
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
                const filePath = path.join(__dirname, 'views', 'wellcome.html');
                return res.sendFile(filePath);

              } else {
                return res.status(404).json({ message: 'Contacto no encontrado' });
              }
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    };       

}

module.exports = new controller()
