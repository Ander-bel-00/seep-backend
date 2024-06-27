const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');

exports.nuevoAdmin = async (req, res, next) => {
    try {

        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);
        req.body.contrasena = hashedPassword;

        await Admin.sync({ force: false });

        // Crear el aprendiz con los datos de la ficha
        const adminData = {
            ...req.body,
        };

        // Verificar si el aprendiz existe antes de crearlo.
        const adminExistente = await Admin.findOne({
            where: {
                numero_documento: req.body.numero_documento
            }
        });
        
        // Si el aprendiz existe me envia un mensaje de error, de lo contrario me crea el aprendiz.
        if (adminExistente) {
            res.status(500).json({ mensaje: 'El admin ya se encuentra registrado'});
        }else{
            // Crea el aprendiz en la base de datos
            const admin = await Admin.create(adminData);

            // Enviar mesnaje de respuesta con los datos de el aprendiz creado.
            res.json({ mensaje: 'El admin ha sido registrado exitosamente', admin });
        }
    } catch (error) {
        console.error('Error al crear un nuevo administrador', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud', error });
        next();
    }
};
