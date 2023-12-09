const ApiError = require('../errors/api-error'); //импорт класса ошибок
const tokenService = require('../service/tokenService');

module.exports = function (req, res, next) {
    // if (req.method === "OPTIONS") {
    //     next();
    // }
    try {
        //проверяю есть ли accessToken
        const authorization = req.headers.authorization;
        if (!authorization) {
            return next(ApiError.UnauthorizedError(401));
        }
        //извлекаю accessToken из headers, по пробелу берем сам токен [1]
        const accessToken = req.headers.authorization.split(' ')[1]
            if (!accessToken) {       //если нет токена
            return next(ApiError.UnauthorizedError(401));
        }
        const userData = tokenService.validateAccessToken(accessToken); //расшифровываю токен
        if(!userData) {
            return next(ApiError.UnauthorizedError(401));
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError(401));
    }
}