const fs = require('fs');
const handlebars = require('handlebars');

// Función para cargar y compilar la plantilla de solicitud de restablecimiento de contraseña
exports.cargarPlantillaResetPasswordRequest = (datos) => {
    try {
        // Cargar el contenido de la plantilla desde el archivo
        const contenidoPlantilla = fs.readFileSync('./views/emails/reset_password_request.hbs', 'utf8');

        // Compilar la plantilla utilizando Handlebars
        const template = handlebars.compile(contenidoPlantilla);

        // Interpolar las variables dinámicas en la plantilla
        const correoInterpolado = template(datos);

        return correoInterpolado;
    } catch (error) {
        console.error('Error al cargar la plantilla de solicitud de restablecimiento de contraseña:', error);
        throw error;
    }
};

exports.ChangePasswordTemplate = (datos) => {
    try {
        // Cargar el contenido de la plantilla desde el archivo
        const contenidoPlantilla = fs.readFileSync('./views/emails/change_password.hbs', 'utf8');

        // Compilar la plantilla utilizando Handlebars
        const template = handlebars.compile(contenidoPlantilla);

        // Interpolar las variables dinámicas en la plantilla
        const correoInterpolado = template(datos);

        return correoInterpolado;
    } catch (error) {
        console.error('Error al cargar la plantilla de solicitud de \n\
        restablecimiento de cambio de contraseña:', error);
        throw error;
    }
};

exports.RegisterAprendiz = (datos) => {
    try {
        // Cargar el contenido de la plantilla desde el archivo
        const contenidoPlantilla = fs.readFileSync('./views/emails/register_aprendiz.hbs', 'utf8');

        // Compilar la plantilla utilizando Handlebars
        const template = handlebars.compile(contenidoPlantilla);

        // Interpolar las variables dinámicas en la plantilla
        const correoInterpolado = template(datos);

        return correoInterpolado;
    } catch (error) {
        console.error('Error al cargar la plantilla de registro de \n\
        aprenidz:', error);
        throw error;
    }
}

exports.VisitasPlantilla = (datos) => {
    try {
        // Cargar el contenido de la plantilla desde el archivo
        const contenidoPlantilla = fs.readFileSync('./views/emails/visitas_email.hbs', 'utf8');

        // Compilar la plantilla utilizando Handlebars
        const template = handlebars.compile(contenidoPlantilla);

        // Interpolar las variables dinámicas en la plantilla
        const correoInterpolado = template(datos);

        return correoInterpolado;
    } catch (error) {
        console.error('Error al cargar la plantilla para las visitas:', error);
        throw error;
    }
}