const request = require('supertest');
const  startServer  = require('./setupTests');
const mongoose = require('mongoose');
const UserModel = require('../models/UserModel'); 
const RoleModel = require('../models/RoleModel');// путь к модели ролей
require('dotenv').config();

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('Test Server', () => {


    test('Login. User exist and return token', async () => {
        const data = {
          email: `${process.env.EMAIL_USER}`,
          password: `${process.env.PASS_USER=123456
          }`
      };
      const response = await request(server)
      .post('/login')
      .send(data)
      .expect(200);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token'); // Проверяем, что в ответе есть свойство 'token'
      expect(typeof response.body.token).toBe('string'); // Проверяем, что токен - это строка
      expect(typeof response.body.userData).toBe('object'); // Проверяем, что есть объект
  });

  test('Login. It should return 404 if user does not exist', async () => {
    const response = await request(server)
      .post('/login')
      .send({
          email: 'nonexistentuser@mail.ru',
          password: `${process.env.PASS_USER}`
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('El usuario con nonexistentuser@mail.ru no existe');
  });

  test('Login. It should return 401 if password is incorrect', async () => {
    const response = await request(server).post('/login').send({
        email: `${process.env.EMAIL_USER}`,
        password: 'wrongpassword'
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Contraseña incorrecta introducida');
  });

  //registration

  test('Registration. It should return error if user already exists', async () => {
    // Подготовка: создание фиктивного пользователя в базе данных
    const existingUser = {
        username: 'Usuario',
        email: `${process.env.EMAIL_USER}`,
        password: `${process.env.PASS_USER}`
    };

    // Отправка запроса на регистрацию с данными, соответствующими уже существующему пользователю
    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(existingUser)
      .expect(400);

    // Проверка, что сервер вернул ожидаемое сообщение об ошибке
    expect(response.body.message).toBe(`Usuario con ${existingUser.username} or ${existingUser.email} ya existe`);
  });

  test('Registration. It should register a new user with valid data and ADMIN role', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    // Отправляем запрос на регистрацию пользователя
    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
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

  test('Registration. It should return validation error if username is missing', async () => {
    const invalidUserData = {
      email: 'testuser@example.com',
      password: `${process.env.PASS_USER}`,
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для отсутствующего username
    expect(response.body.errors).toContainEqual({
      message: 'Nombre de usuario no puede estar vacía.',
    });
  });
  test('Registration. It should return validation error if Email is missing', async () => {
    const invalidUserData = {
      password: `${process.env.PASS_USER}`,
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для отсутствующего username
    expect(response.body.errors).toContainEqual({
      message: 'Email no puede estar vacía.',
    });
  });
  test('Registration. It should return validation error if email is not a valid email address', async () => {
    const invalidUserData = {
      username: 'Usuario',
      email: 'invalidemail',
      password: `${process.env.PASS_USER}`,
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для неверного email
    expect(response.body.errors).toContainEqual({
      message: 'No es la dirección de correo electrónico.',
    });
  });

  test('Registration. It should return validation error if password length is not within the specified range', async () => {
    const invalidUserData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'short',
    };

    const response = await request(server)
      .post('/registration')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(invalidUserData)
      .expect(400);

    // Проверки, что в ответе есть сообщение об ошибке валидации для короткого пароля
    expect(response.body.errors).toContainEqual({
      message: 'La contraseña debe tener más de 6 y menos de 20 caracteres.',
    });
  });

  // getUsers
  test('Get users. It should get users with ADMIN role', async () => {
    const userData = {
      email: `${process.env.EMAIL_ADMIN}`,
      password: `${process.env.PASS_USER}`,
    };

    const response = await request(server)
      .get('/users')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(userData)
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  //getUserByUsername
  test('Get User By Username. It should get user by username with USER role', async () => {
    const username = 'Usuario';
    const response = await request(server)
      .get('/personal')
      .query({ username })
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`); 

    expect(response.statusCode).toBe(200);
    // Проверка других ожидаемых результатов, например, что объект пользователя есть в теле ответа

    // Проверка наличия свойства user в ответе
    expect(response.body).toHaveProperty('user');
    // Проверка других ожидаемых свойств или значений в объекте пользователя
  });

  test('Get User By Username. It should return 404 if user is not found', async () => {
    const nonExistingUsername = 'nonExistingUser'; // Замените на несуществующее имя пользователя
    const response = await request(server)
      .get('/personal')
      .query({ username: nonExistingUsername })
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`); 

    expect(response.statusCode).toBe(404);
  });

  test('Put User. It should update user', async () => {
    const newUserData = {
      _id: `${process.env.ID_USER}`,
      username: 'newUsername',
      email: 'newemail@example.com'
    };

    const response = await request(server)
      .put('/users')
      .query({ _id: newUserData._id })
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send(newUserData)
      .expect(200); // Ожидаемый статус кода

    expect(response.body).toHaveProperty('username', 'newUsername'); // Проверка обновления имени пользователя
    const userData = {
      _id: `${process.env.ID_USER}`,
      username: 'Usuario',
      email: 'slavafit@mail.ru'
    };
    await UserModel.findByIdAndUpdate(userData._id, userData, { new: true });
  });

  test('Put User. It should return validation error for empty username', async () => {
    const userData = {
      _id: `${process.env.ID_USER}`,
      username: '', // Пустое имя пользователя
      email: 'newemail@example.com'
    };

    const response = await request(server)
      .put('/users')
      .query({ _id: userData._id })
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send(userData)
      .expect(400); // Ожидаемый статус кода для ошибки валидации

    // Проверка наличия сообщения об ошибке валидации
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);

    // Проверка конкретного сообщения об ошибке валидации
    expect(response.body.errors[0]).toHaveProperty('message', 'Nombre de usuario no puede estar vacía.');
  });

  test('Put User. It should return validation error for empty email', async () => {
    const userData = {
      _id: `${process.env.ID_USER}`,
      username: 'Usuario', 
      email: ''
    };

    const response = await request(server)
      .put('/users')
      .query({ _id: userData._id })
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send(userData)
      .expect(400); // Ожидаемый статус кода для ошибки валидации

    // Проверка наличия сообщения об ошибке валидации
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);

    // Проверка конкретного сообщения об ошибке валидации
    expect(response.body.errors[0]).toHaveProperty('message', 'Email no puede estar vacío.');
    expect(response.body.errors[1]).toHaveProperty('message', 'No es la dirección de correo electrónico.');
  });

  test('Change Password. It should return validation error for empry new and old password, ', async () => {
    const data = {
      oldPassword: '',
      newPassword: '',
    };

    const response = await request(server)
      .post(`/changepassword/${process.env.ID_USER}`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(data)
      .expect(400);

    expect(response.body.errors[0]).toHaveProperty('message', 'La contraseña anterior está vacía.');
    expect(response.body.errors[1]).toHaveProperty('message', 'La nueva contraseña no puede estar vacía.');
  });
  test('Change Password. It should return validation error new password', async () => {
    const data = {
      oldPassword: `${process.env.PASS_USER}`,
      newPassword: '12345',
    };

    const response = await request(server)
      .post(`/changepassword/${process.env.ID_USER}`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(data)
      .expect(400);

    expect(response.body.errors[0]).toHaveProperty('message', 'La contraseña debe tener más de 6 y menos de 20 caracteres.');
  });
  test('Change Password. It should return user not founded', async () => {
    const data = {
      oldPassword: '123456789',
      newPassword: '123456789',
    };

    const response = await request(server)
      .post(`/changepassword/65560d68f5c5cc7d19491f80`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send(data)
      .expect(404);

      expect(response.body.message).toBe('Usuario no encontrado');
  });
  test('Change Password. It should return old password not correct', async () => {
    const data = {
      oldPassword: '12345789',
      newPassword: '12345789',
    };

    const response = await request(server)
      .post(`/changepassword/${process.env.ID_USER}`)
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send(data)
      .expect(401);

      expect(response.body.message).toBe('Se ingresó una contraseña antigua incorrecta');
  });

  test('Forgot Password. It should return validation error if Email is missing', async () => {
    const data = {
      email: ''
      };

    const response = await request(server)
      .post('/resetpassword/forgot')
      .send(data)
      .expect(400);

      expect(response.body.errors[0]).toHaveProperty('message', 'Email no puede estar vacío');
  });
  test('Forgot Password. It should return validation error Email is not a valid email address', async () => {
    const data = {
      email: 'invalidemail'
      };

    const response = await request(server)
      .post('/resetpassword/forgot')
      .send(data)
      .expect(400);

      expect(response.body.errors[0]).toHaveProperty('message', 'No es un correo electrónico.');
  });
  test('Forgot Password. It should return user not founded', async () => {
    const data = {
      email: 'fakemail@gmail.com'
    };

    const response = await request(server)
      .post(`/resetpassword/forgot`)
      .send(data)
      .expect(404);

      expect(response.body.message).toBe('Usuario no encontrado');
  });
});