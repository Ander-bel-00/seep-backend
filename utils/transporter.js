const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seep.sena.edu@gmail.com',
        pass: 'rgjl jwlk iinc ouvv'
    }
});

module.exports = transporter;
