// indexTest.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');
const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/", router);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.error('Server failed to start:', e);
    throw e;
  }
};

module.exports =  startServer ;