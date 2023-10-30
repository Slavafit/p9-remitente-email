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
    },
)


const mailer = (mailMessage) => {
    transporter.sendMail(mailMessage, (err, info) => {
        if(err) return console.log(err)
        // console.log('Email sent: ', info)
    })
}

module.exports = mailer