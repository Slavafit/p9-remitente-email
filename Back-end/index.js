require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');
const PORT = process.env.PORT || 5000;
const app = express();
const multer = require('multer');

// Настройка multer для сохранения файлов в папке uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads') // Укажите папку, куда будут сохраняться загруженные файлы
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Укажите имя файла на сервере
  }
});

const upload = multer({ storage: storage });

// Использование multer как промежуточного ПО для обработки файлов
app.use(upload.single('image'));
// Разрешите CORS для всех запросов
app.use(cors());
app.use(express.json());
app.use("/", router);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();