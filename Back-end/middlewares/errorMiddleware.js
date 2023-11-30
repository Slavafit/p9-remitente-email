const ApiError = require('../errors/api-error') //импорт класса ошибок

//первый парамент сама ошибка err, это важно!!
module.exports = function (err, req, res, next) {
    console.log(err.message);
    if (err instanceof ApiError) {
        //если ошибка инстенс класса, то сразу возврат на клиент, errors это массив ошибок
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Server error'})
}