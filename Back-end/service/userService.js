const UserModel = require('../models/UserModel');
const RoleModel = require('../models/RoleModel');
const mailService = require('./mailService');     //импорт настроек
const tokenService = require('../service/tokenService')
const bcrypt = require('bcrypt');
require('dotenv').config();
const uuid = require('uuid');
const path = require('path');
const UserDto = require('../dtos/userDto');
const ApiError = require('../errors/api-error')

class userService {
    //регистрация пользователя
    async registration(username, email, password) {
        // приведение email к нижнему регистру
        const lowerCaseEmail = email.toLowerCase();
        //ищем пользователя в БД
        const candidate = await UserModel.findOne({ $or: [{ username }, { email: lowerCaseEmail }] });    
        if (candidate) {        //если нашли вернули сообщение
            throw ApiError.BadRequest(`Usuario con ${username} or ${lowerCaseEmail} ya existe`);
        }
        const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
        const activationLink = uuid.v4(); // генерируем случайный адрес
        const link = `${process.env.BACK_URL}/activation/${activationLink}`;
        const userRole = await RoleModel.findOne({value: "USER"})    //ищем роль
        //создаем пользователя
        const user = await UserModel.create({
            username,
            email: lowerCaseEmail, 
            password: hashPassword,
            roles: [userRole.value],
            activationLink
        })
        //создаем ДТО с данными пользователя
        const userDto = new UserDto(user);  //userId, username, role, email
        //создаю токены
        const tokens = await tokenService.generateTokens({...userDto});
        //записываю токен в базу
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        //отправляю письмо
            const mailMessage = {
                from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
                to: `${lowerCaseEmail}`,
                subject: `Registrado exitosamente en nuestro sitio "Remitente de invitaciones."`,
                html: `
                <h2>Felicidades, ${username}! Estás registrado exitosamente en nuestra pagina web</h2>
                
                <i>información de su cuenta:</i>
                <ul>
                    <li>nombre de usuario: ${username}</li>
                    <li>correo electrónico: ${lowerCaseEmail}</li>
                    <li>contraseña: ${password}</li>
                </ul>
                <h4>Para activar su cuenta sigue a esta enlace: <a href="${link}">aquí</a></h4>
                <p>Esta carta no requiere respuesta.<p>`
            }
        mailService(mailMessage)
            .then(info => {
                // Обработка успешной отправки
                console.log('Email sent: ', info.response);
            })
            .catch(err => {
                // Обработка ошибок
                console.error('Error sending email: ', err);
            });
        return ({...tokens, userDto})
    };

    //вход пользователя
    async login(email, password) {
        // приведение email к нижнему регистру
        const lowerCaseEmail = email.toLowerCase();
        //ищем пользователя в базе
        const user = await UserModel.findOne({email: lowerCaseEmail })
        //если не найден, то объект будет пустой и пойдет по условию ниже
        if (!user) {
            throw ApiError.BadRequest(404,`El usuario con '${email}' no existe`)
        }
        //расшифровываю пароль клиента при помощи compareSync
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            throw ApiError.BadRequest(400,`Contraseña incorrecta introducida`)
        }
        //проверяю, активировался ли пользователь
        if (!user.isActivated) {
            throw ApiError.BadRequest(400,`El usuario todavía no está activado`)
        }
        //создаем ДТО с данными пользователя
        const userDto = new UserDto(user);  //userId, username, role, email
        //генерирую токены и отправляю клиенту
        // const tokens = tokenService.generateTokens(user._id, user.roles);
        const tokens = tokenService.generateTokens({...userDto});
        //записываю токен в базу
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        // const userData = {userId: user._id, username: user.username, role: user.roles[0]}
        return ({...tokens, userDto})
    };

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;

    };

     //активация пользователя
     async aсtivateUser(activationLink) {
        //ищем пользователя в базе
        const user = await UserModel.findOne({activationLink})
        //если не найден, то объект будет пустой и пойдет по условию ниже
        if (!user) {
            throw ApiError.BadRequest(404, `El usuario no encontrado`)
        }
        // Проверяем, совпадает ли переданный activationLink с сохраненным значением в модели пользователя
        if (user.activationLink !== activationLink) {
            throw ApiError.BadRequest(400, 'Enlace de activación inválido');
        }
        //проверяю, активировался ли пользователь
        if (user.isActivated) {
            const filePath = path.join(__dirname, '..', 'views', 'noActivation.html');
            return (filePath);
        }
        // Обновляю значение isActivated на true
        await UserModel.findOneAndUpdate(
            { activationLink },
            { $set: { isActivated: true } },
            );

        const filePath = path.join(__dirname, '..', 'views', 'activation.html');
        return (filePath);
    };

    //Обработчик обновления пользователя
    async updateUser(_id, updatedUser) {
        //Заменяем найденное новым объектом
        const user = await UserModel.findByIdAndUpdate(_id, updatedUser, { new: true });
        if (!user) {
            throw ApiError.BadRequest(404, `El usuario no actualizado`);
        }
        return(user); // обновленные данные в ответе
    };

    // Обработчик для смены пароля
    async changePassword(id, oldPassword, newPassword) {
        // console.log(oldPassword,newPassword)
        //ищем пользователя в базе
        const user = await UserModel.findById(id)
        //если не найден, то объект будет пустой и пойдет по условию ниже
        if (!user) {
            throw ApiError.BadRequest(404, `Usuario no encontrado`)
        }
        const email = user.email;
        //расшифровываю пароль клиента при помощи compareSync
        const validPassword = bcrypt.compareSync(oldPassword, user.password)
        if (!validPassword) {
            throw ApiError.BadRequest(400, `Se ingresó una contraseña antigua incorrecta`)
        }

        const hashPassword = bcrypt.hashSync(newPassword, 7);  //захешировали пароль
        const updatedUser = await UserModel.findByIdAndUpdate(
            id, 
            {password: hashPassword}, 
            { new: true }
        );

        if (!updatedUser) {
            throw ApiError.BadRequest(400, `User not updated` );
        }
        const mailMessage = {
            from: 'Remitente de la invitación. Fondación Don Bosco <slavfit@gmail.com>',
            to: `${email}`,
            subject: `Aviso de cambio de contraseña en el sitio web "Remitente de invitaciones"`,
            html: `
            <h2Has establecido una nueva contraseña</h2>
            
            <h4>Tu nueva contraseña: ${newPassword}</h4>
            
            <p>Esta carta no requiere respuesta.<p>`
        }
        mailService(mailMessage);

        return(updatedUser); // обновленные данные в ответе
    };

    // Обработчик для создания ссылки сброса пароля
    async forgotPassword(email) {
            //ищем пользователя в базе
            const user = await UserModel.findOne({email})
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                throw ApiError.BadRequest(404, `Usuario no encontrado`)
            }
            const token = uuid.v4(); // генерируем случайный токен
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
            mailService(mailMessage);

        return ({message:'El enlace se ha enviado a su correo electrónico'});
    };

    // Обработчик для сброса пароля
    async resetPassword(id, token, password) {
            //ищем пользователя в базе
            const user = await UserModel.findOne({
                _id: id, 
                resetPasswordToken: token, 
                resetPasswordExpires: { $gt: Date.now() } 
            });
            if (!user) {
                throw ApiError.BadRequest(400, 'Token de reinicio no válido o caducado');
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
            mailService(mailMessage);

        return ({ message: 'Contraseña se ha restablecido' });
    };

    // Обработчик для удаления User по Id
    async deleteUser(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw ApiError.BadRequest(404,`El usuario no enontrado`)
        }
        // Если user найден, удаляем
        await UserModel.findByIdAndDelete(id);
    
        return user;
    };
    //получить список пользователей
    async getUsers() {
            const users = await UserModel.find()
            const userDtos = users.map(user => new UserDto(user));
            return userDtos;
    };
    //обработчик получения данных по username
    async getUserByUsername(username) {
        const user = await UserModel.findOne({username});    
        if (!user) {
            throw ApiError.BadRequest(404,`El usuario con ${username} no enontrado`)
        }
        const userDto = new UserDto(user);  //userId, username, role, email
        return userDto;
    };
    //обновляем refreshToken
    async refresh(refreshToken) {
        if (!refreshToken) {    //проверка, если токена нет
            throw ApiError.UnauthorizedError(401);
        }
        const userData = tokenService.validateRefreshToken(refreshToken);   //валидирую токен
        const tokenFromDB = await tokenService.findToken(refreshToken);     //ищу токен в Б
        if (!userData || !tokenFromDB) {
            console.log("401");
            throw ApiError.UnauthorizedError(401);
        }
        const user = await UserModel.findById(userData.id.userId)  //ищу по id из payload
        //создаем ДТО с данными пользователя
        const userDto = new UserDto(user);  //userId, username, role, email
        //генерирую токены и отправляю клиенту
        const tokens = tokenService.generateTokens({...userDto, roles:user.roles});
        //записываю токен в базу
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        return ({...tokens, userDto})
    }
}

module.exports = new userService()