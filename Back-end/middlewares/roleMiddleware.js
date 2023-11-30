const ApiError = require('../errors/api-error'); //импорт класса ошибок
const tokenService = require('../service/tokenService');
const jwt = require('jsonwebtoken');

module.exports = function (roles) {             //передаем массив ролей!!!
    return function (req, res, next) {
        if (req.method === "OPTIONS") {     //исключаем метод запросов OPTIONS
            next();
        }
        try {
            //проверяю есть ли accessToken
            const authorization = req.headers.authorization;
            if (!authorization) {
                return next(ApiError.UnauthorizedError(401));
            }
            //извлекаю токен из заголовков, делим строку на 2 части и берем вторую часть [1]
            const accessToken = req.headers.authorization.split(' ')[1]
                if (!accessToken) {       //если токена нэма  
                    return next(ApiError.UnauthorizedError(401));
            }
            const userDto = tokenService.validateAccessToken(accessToken); //расшифровываю токен и достаю roles
            //присваиваю массиву roles имя userRoles, которое получаю используя деструктуризацию
            const { roles: userRoles } = userDto.id;
            let hasRole = false     //по умолчанию
            userRoles.forEach(role => {     //проверка, есть ли в списке ролей те роли, которые разрешены для этой функции
                if (roles.includes(role))   //если массив roles содержит в себе роль, которая есть у пользователя
                hasRole = true      //то меняем на тру
            });
            if (!hasRole) {         //если роль не разрешена возврат клиенту
                return next(ApiError.UnauthorizedError(403));
            }
            next();
        } catch (e) {
            return next(ApiError.UnauthorizedError(401));
        }
    }
}