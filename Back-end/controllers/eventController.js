const eventService = require('../service/eventService')
const { validationResult } = require('express-validator')
require('dotenv').config();

class eventController {
    // Обработчик получения Events
    async getEvents(req, res, next) {
        try {
            //вызываю сервис и передаю параметы
            const сontacts = await eventService.getEvents();    
            return res.json(сontacts)  //вернули сообщение клиенту
        } catch (e) {
            next(e)
        }
    };
    // Обработчик создания Event
    async createEvent(req, res, next) {
        try {
            const eventData = req.body; // Данные из тела запроса
            // console.log("createContact",contactData);
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = error.array().map(error => ({
                    message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            //вызываю сервис и передаю параметы
            const event = await eventService.createEvent(eventData);    
            return res.json(event)  //вернули сообщение клиенту
        } catch (e) {
            next(e)
        }
    };
    // Обработчик обновления Event  
    async updateEvent(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                    message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const { id } = req.params;
            const eventData = req.body; // обновленные данные  из тела запроса
            const event = await eventService.updateEvent(id, eventData);    

            res.json(event); // Отправьте обновленные данные event в ответе
        } catch (e) {
            next(e)
        }
    };

    // Обработчик удаления Event
    async deleteEvent(req, res, next) {
        const eventId = req.params.id;
        // console.log("Received deleteEvent request with Id:", eventId);
        try {
        const response = await eventService.deleteEvent(eventId);    
            res.json(response);
        } catch (e) {
            next(e);
        }
    };
}
module.exports = new eventController()