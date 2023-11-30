const ContactModel = require('../models/ContactModel');
require('dotenv').config();
const ApiError = require('../errors/api-error')


class contactService {
    // Обработчик получения Contact
    async getContacts() {
            const contacts = await ContactModel.find()
            return(contacts)
    };
    // Обработчик создания Contact
    async createContact(contactData) {
        const candidate = await ContactModel.findOne({ email: contactData.email })    //ищем данные в БД
        if (candidate) {        //если нашли вернули сообщение
            throw ApiError.BadRequest(`Contacto con '${contactData.email}' ya existe`)
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
        return ({message: `'${contactData.nombre}' con '${contactData.email}' guardado correctamente.`})
    };
    // Обработчик обновления Contact  
    async updateContact(id, сontactData) {
            //Заменяем  новым объектом
            const сontact = await ContactModel.findByIdAndUpdate(id, сontactData, { new: true });
            if (!сontact) {
                throw ApiError.BadRequest(400, `Contact ${сontactData.nombre} no actualizado` );
            }
            return(сontact); // Отправьте обновленные данные сontact в ответе
    };

    // Обработчик удаления Contact
    async deleteContact(contactId) {
        const contact = await ContactModel.findByIdAndDelete(contactId);
        if (!contact) {
            throw ApiError.BadRequest(400, `Contacto no actualizado` );
        }
        return ({ message: `Contacto eliminado correctamente` });
    };
}
 module.exports = new contactService();