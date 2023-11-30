module.exports = class ApiError extends Error {
    //ожидаем статус http и ошибку
    status;
    errors;

    constructor(status, message, errors = []) {
        //вызываю родительский конструктор и передаю туда:
        super(message);
        this.status = status;
        this.errors = errors;
        //в инстанс класса помещаем статус и ошибки
    }
    //функции без вызова экземпляра класса:
    static UnauthorizedError(status) {
        const message = status === 401 ? 'El usuario no está autorizado' : 'El usuario no tiene acceso';
        return new ApiError(status, message);
    }
    

    static BadRequest(status, message, errors = []) {
        return new ApiError(status, message, errors);
    }
}
