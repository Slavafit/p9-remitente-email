const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'slavfit@gmail.com', 
            pass: 'pxwmekrmfyyrcour' 
        }
    }
);

// const mailer = (mailMessage) => {
//     transporter.sendMail(mailMessage, (err, info) => {
//         if(err) return console.log(err)
//         // console.log('Email sent: ', info)
//     })
// };

const mailer = (mailMessage) => {
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


module.exports = mailer