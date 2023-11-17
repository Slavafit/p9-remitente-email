const request = require('supertest');
const getServer = require('./setupTests')
const UserModel = require('../models/UserModel'); 
const RoleModel = require('../models/RoleModel');// путь к модели ролей
const app = require('../index');
const { server } = require('./setupTests');


describe('Test user registration', () => {

  test('It should return error if user already exists', async () => {
    // Подготовка: создание фиктивного пользователя в базе данных
    const existingUser = {
        username: 'Usuario',
        email: 'slavafit@mail.ru',
        password: '123456'
    };

    // Отправка запроса на регистрацию с данными, соответствующими уже существующему пользователю
    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(existingUser)
      .expect(400);

    // Проверка, что сервер вернул ожидаемое сообщение об ошибке
    expect(response.body.message).toBe(`Usuario con ${existingUser.username} or ${existingUser.email} ya existe`);
  });

  test('It should register a new user with valid data and ADMIN role', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };
    
    // Создаем роль "USER" перед тестом
    const userRole = await RoleModel.findOne({value: "USER"})
    await userRole.save();

    // Отправляем запрос на регистрацию пользователя
    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(userData)
      .expect(200);

    // Проверяем, что в ответе есть сообщение об успешной регистрации
    expect(response.body.message).toBe(`Usuario ${userData.username} ha sido registrado exitosamente`);

    // Проверяем, что пользователь действительно добавлен в базу данных
    const user = await UserModel.findOne({ username: userData.username });
    expect(user).toBeTruthy();

    // Проверяем, что у пользователя есть роль "USER"
    expect(user.roles).toContain('USER');
    //удаляем созданного пользователя
    await UserModel.findByIdAndDelete(user._id);
  });

  test('It should return validation error if username is missing', async () => {
    const invalidUserData = {
      email: 'testuser@example.com',
      password: '123456',
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для отсутствующего username
    expect(response.body.errors).toContainEqual({
      message: 'Nombre de usuario no puede estar vacía.',
    });
  });
  test('It should return validation error if username is missing', async () => {
    const invalidUserData = {
      password: '123456',
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для отсутствующего username
    expect(response.body.errors).toContainEqual({
      message: 'Email no puede estar vacía.',
    });
  });
  test('It should return validation error if email is not a valid email address', async () => {
    const invalidUserData = {
      username: 'Usuario',
      email: 'invalidemail',
      password: '123456',
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для неверного email
    expect(response.body.errors).toContainEqual({
      message: 'No es la dirección de correo electrónico.',
    });
  });

  test('It should return validation error if password length is not within the specified range', async () => {
    const invalidUserData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'short',
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUzOTEwM2I1M2Y0NDNhNWZlYWNkOCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTcwMDA4NDQwOCwiZXhwIjoxNzAwMTcwODA4fQ.-fq7GDuTnLjpz6KBwqcYpwyGN5RyXDUC0MgsP7PV_H4')
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для короткого пароля
    expect(response.body.errors).toContainEqual({
      message: 'La contraseña debe tener más de 6 y menos de 20 caracteres.',
    });
  });

  // Добавьте другие тесты, например, для проверки ошибок валидации, дублирования пользователя и т. д.
});
