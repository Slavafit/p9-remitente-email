const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    }
);


const mailService = (mailMessage) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailMessage, (err, info) => {
            if (err) {
                reject(err); // Если произошла ошибка, отклоняем промис с этой ошибкой
            } else {
                resolve(info); // Если успешно отправлено, разрешаем промис с информацией об отправке
            }
        });
    });
};


module.exports = mailService