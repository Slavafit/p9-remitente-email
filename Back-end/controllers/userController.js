const UserModel = require('../models/UserModel');
const userService = require('../service/userService')
const { validationResult } = require('express-validator')
require('dotenv').config();

class userController {

    //регистрация пользователя
    async registration(req, res, next) {
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
            const data = await userService.registration(username, email, password)

            return res.json({message: `Usuario "${username}" ha sido registrado exitosamente`, data})
        } catch (e) {
            next(e);
        }
    };


    //активация пользователя
    async aсtivateUser(req, res, next) {
        try {
            const { activationLink } = req.params;
            //обраащаюсь к сервису
            const filePath = await userService.aсtivateUser(activationLink)
            //вернули файл на клиент
            return res.sendFile(filePath);
        } catch (e) {
            next(e);
        }
    };

    //вход пользователя
    async login(req, res, next) {
        try {
            const { email, password } = req.body   //получили данные от клиента
            //вызываю сервис
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            //возвращаю данные на клиент
            return res.json({accessToken: userData.accessToken, userDto: userData.userDto})
        } catch (e) {
            next(e);
        }
    };

    //обработчик выхода    
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    };
    //обработчик обновления токена
    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            //возвращаю данные на клиент
            console.log(userData);
            return res.json(userData.tokens)
        } catch (e) {
            next(e);
        }
    }

    // Обработчик для удаления User по Id
    async deleteUser(req, res, next) {
        try {
            const { id }  = req.params; // id из параметров
            // console.log("Received deleteUser request with Id:", id);
            const user = await userService.deleteUser(id);
            if (!user) {
                return res.status(404).json({ message: `User not found` });
            }
            return res.json({ message: `User with ${user} deleted` });
        } catch (e) {
            next(e);
        }
    };
    //получить список пользователей
    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            res.json(users)
        } catch (e) {
            next(e);
        }
    };
    //получить данные пользователя по username
    async getUserByUserName(req, res, next) {
        try {
            const { username } = req.params;
            // console.log("Received getUserByUsername request with:", username);
            const user = await userService.getUserByUsername(username);    
            //отдаем на клиент данные с userService
            return res.json(user)
        } catch (e) {
            next(e);
        }
    };
    //Обработчик обновления пользователя
    async updateUser(req, res, next) {
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
            const updatedUser = req.body; // обновленные данные из тела запроса
            const user = await userService.updateUser(id, updatedUser);    
            res.json(user); // обновленные данные в ответе
        } catch (e) {
            next(e)
        }
    };
    // Обработчик для смены пароля
    async changePassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                    message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const {id} = req.params;
            const { oldPassword, newPassword } = req.body; // обновленные данные из тела запроса
            // console.log(oldPassword,newPassword)
            const updatedUser = await userService.changePassword(id, oldPassword, newPassword);    

            res.json(updatedUser); // обновленные данные в ответе
        } catch (e) {
            next(e)
        }
    };
    // Обработчик для создания ссылки сброса пароля
    async forgotPassword(req, res, next) {
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
            const userData = await userService.forgotPassword(email);    

            res.json(userData);
        } catch (e) {
            next(e)
        }
    };
    // Обработчик для сброса пароля
    async resetPassword(req, res, next) {
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
            const userData = await userService.resetPassword(id, token, password);    

            res.json(userData);
        } catch (e) {
            next(e)
        }
    };
}

module.exports = new userController()