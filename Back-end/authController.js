const UserModel = require('./models/UserModel')
const RoleModel = require('./models/RoleModel')   //импорт модели
const Song = require('./models/Song')
const mailer = require('./mailer');     //импорт настроек
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
} 

class authController {


    async registration(req, res) {
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
            const candidate = await UserModel.findOne({ $or: [{ username }, { email }] });    //ищем пользователя в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `User with ${username} or ${email} already exists`});
            }
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            const userRole = await RoleModel.findOne({value: "USER"})    //ищем роль
            const user = new UserModel({username, email, password: hashPassword, roles: [userRole.value]})  //создаем пользователя
            await user.save()   //сохраняем в БД
            
            const mailMessage = {
                from: 'Cloud Music, slavafit@mail.ru',
                to: `${email}`,
                subject: `Successfully registred on our site`,
                html: `
                <h2>Congratulations, ${username}! You are successfully registred on our site!</h2>
                
                <i>your account information:</i>
                <ul>
                    <li>username: ${username}</li>
                    <li>email: ${email}</li>
                    <li>password: ${password}</li>
                </ul>
                
                <p>This letter does not require a reply.<p>`
            }
            mailer(mailMessage);
            return res.json({message: `User ${username} has been successfully registered`})  //вернули сообщение клиенту

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', error: e.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body   //получили данные от клиента
            //ищем пользователя в базе
            const user = await UserModel.findOne({email})
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `User with ${email} not found`})
            }
            //расшифровываю пароль клиента при помощи compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Incorrect password entered`})
            }
            //генерирую токен и отправляю клиенту
            const token = generateAccessToken(user._id, user.roles)
            const userData = {userId: user._id, username: user.username, role: user.roles[0]}
            return res.json({token, userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (e) {

        }
    }

    async getUserByUsername(req, res) {
        try {
            const { username } = req.query;
            // console.log("Received getUserByUsername request with:", username);
            //ищем пользователя в базе
            const user = await UserModel.findOne({username});    
       
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `User with ${username} not found`})
            }
            //const users = await User.find()
            return res.json({user})
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

   


    // Обработчик для удаления User по Id
    async deleteUser(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            // console.log("Received deleteUser request with Id:", _id);
            const user = await User.findById(_id); // Используйте _id напрямую
            if (!user) {
                return res.status(404).json({ message: `User with ${_id} not found` });
            }
            // Если user найден, удаляем
            // console.log("User Id: ", _id, " deleted");
            await user.deleteOne({_id});
        
            return res.json({ message: `User with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    async postSong(req, res) {
        try {
            const { artist, track, year, fileUrl, coverUrl, category} = req.body;
            const candidate = await Song.findOne({ $and: [{ artist }, { track }] })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: "Such an artist with such a track already exists"})
            }
            const song = new Song({artist, track, year, fileUrl, coverUrl, category })  //создаем пользователя
            await song.save()   //сохраняем в БД
            return res.json({message: `artist: ${artist} with track: ${track} successfully saved`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Post error'})
        }
    }

    async getSongs(req, res) {
        try {
            const songs = await Song.find()
            res.json(songs)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'getSongs error'})
        }
    }

    async getSong(req, res) {
        try {
            const { search, category  } = req.query;
            if (!search && !category) {
                return res.status(400).json({ message: 'Search query or category is required' });
            }
            let query = {};
            if (search && category) {
                query = {
                    $or: [
                        { artist: { $regex: search, $options: 'i' } },
                        { track: { $regex: search, $options: 'i' } },
                    ],
                    category: category
                };
            } else if (search) {
                query = {
                    $or: [
                        { artist: { $regex: search, $options: 'i' } },
                        { track: { $regex: search, $options: 'i' } },
                    ]
                };
            } else if (category) {
                query = {
                    category: category
                };
            }
            

            
            const songs = await Song.find(query);
            
            if (songs.length === 0) {
                return res.status(404).json({ message: 'No results found' });
            }
            
            res.json(songs);
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Search error'})
        }
    }

    async getSongsById(req, res) {
        try {
            const { _id } = req.query;
            // console.log("Received findById request with Id:", _id);
            const song = await Song.findById(_id);
    
            if (!song) {
                return res.status(404).json({ message: `Song with ${_id} not found` });
            }
    
            res.json(song);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    // Обработчик для изменения песни по Id
    async updateSongs(req, res) {
        try {
            const { _id } = req.query;
            const updatedSong = req.body; // обновленные данные песни из тела запроса
            //Заменяем найденую песню новым объектом
            const song = await Song.findByIdAndUpdate(_id, updatedSong, { new: true });

            if (!song) {
                return res.status(400).json({ message: `Song with ${_id} not updated` });
            }

            res.json(song); // Отправьте обновленные данные песни в ответе

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обработчик для удаления песни по ID
    async deleteSongs(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            const song = await Song.findById(_id); // Используйте _id напрямую
            if (!song) {
                return res.status(404).json({ message: `Song with ${_id} not found` });
            }

            // Если песня найдена, удаляем её
            await song.deleteOne({_id});
            return res.json({ message: `Song with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

}

module.exports = new authController()
