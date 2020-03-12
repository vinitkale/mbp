const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

class APIMailer{
    constructor(message) {
        this.message = message;
    }

    sendMail(message = false){
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
               user: process.env.MAIL_FROM,
               pass: process.env.MAIL_PASSWORD
            }
        });
        
        transport.sendMail(message ? message : this.message, function(err, info) {
            if (err) {
            console.log(err)
            } else {
            console.log(info);
            }
        });
        
    }
}

module.exports = APIMailer;