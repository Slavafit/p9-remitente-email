const ListModel = require('../models/ListModel');
const { validationResult } = require('express-validator')
require('dotenv').config();

class listService {

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

module.exports = new listService()