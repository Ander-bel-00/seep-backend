const transporter = require('./transporter');

// Función para enviar correo electrónico
async function enviarCorreo(destinatario, asunto, cuerpo) {
    try {
        // Configuración del correo electrónico
        const correoOptions = {
            from: 'seep.sena.edu@gmail.com',
            to: destinatario,
            subject: asunto,
            html: cuerpo
        };

        // Enviar el correo electrónico
        await transporter.sendMail(correoOptions);
        console.log('Correo electrónico enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
}

module.exports = enviarCorreo;