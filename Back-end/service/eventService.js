const EventModel = require('../models/EventModel');
require('dotenv').config();
const ApiError = require('../errors/api-error');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

class eventService {
    // Обработчик получения event
    async getEvents(req, res) {
            const events = await EventModel.find()
            return(events)
    };
    // Обработчик создания event
    async createEvent(eventData) {

            const candidate = await EventModel.findOne({ name: eventData.name })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                throw ApiError.BadRequest(400, `Evento ${eventData.name} ya existe`)
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
            return ({message: `Evento ${eventData.name} guardado correctamente`})  //вернули сообщение клиенту

    };
    // Обработчик обновления event    
    async updateEvent(id, eventData) {
            //Заменяем  новым объектом
            const event = await EventModel.findByIdAndUpdate(id, eventData, { new: true });
            if (!event) {
                throw ApiError.BadRequest(400, `Evento ${eventData.name} no actualizado` );
            }
            return(event); // Отправьте обновленные данные event в ответе

    };
    // Обработчик удаления event
    async deleteEvent(eventId) {
            const event = await EventModel.findByIdAndDelete(eventId);
            if (!event) {
              throw ApiError.BadRequest(404, 'Evento no encontrado');
            }
            return ({ message: 'Evento borrado correctamente' });
    }; 
}
module.exports = new eventService();