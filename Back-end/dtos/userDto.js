module.exports = class UserDto {
    userId;
    username;
    email;
    roles;
    //из модели берем нужные поля и экспортируем
    constructor(model) {
        this.userId = model._id;
        this.username = model.username;
        this.email = model.email;
        this.roles = model.roles
    }
}