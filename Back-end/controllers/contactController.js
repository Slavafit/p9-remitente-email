const contactService = require('../service/contactService')
const { validationResult } = require('express-validator')
require('dotenv').config();

class contactController {
    // Обработчик получения Contacts
    async getContacts(req, res, next) {
        try {
            //вызываю сервис и передаю параметы
            const сontacts = await contactService.getContacts();    
            return res.json(сontacts)  //вернули сообщение клиенту
        } catch (e) {
            next(e)
        }
    };
    // Обработчик создания Contact
    async createContact(req, res, next) {
        try {
            const contactData = req.body; // Данные из тела запроса
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
            const сontact = await contactService.createContact(contactData);    
            return res.json(сontact)  //вернули сообщение клиенту
        } catch (e) {
            next(e)
        }
    };
    // Обработчик обновления Contact  
    async updateContact(req, res, next) {
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
            const сontactData = req.body; // обновленные данные  из тела запроса
            const сontact = await contactService.updateContact(id, сontactData);    

            res.json(сontact); // Отправьте обновленные данные event в ответе
        } catch (e) {
            next(e)
        }
    };
    // Обработчик удаления Contact
    async deleteContact(req, res, next) {
        const contactId = req.params.id;
        // console.log("Received deleteContacts request", contactId);
        try {
        const response = await contactService.deleteContact(contactId);    
            res.json(response);
        } catch (e) {
            next(e);
        }
    };
}
module.exports = new contactController()