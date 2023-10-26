const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authRouter');
const PORT = 5000;

const app = express();

// Разрешите CORS для всех запросов
app.use(cors());

app.use(express.json());
app.use("/", authRouter);

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://slavafit:MsAf0I1d5DyfmOdQ@cluster0.hgrbgup.mongodb.net/Remitente?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();