const Admin = require("../models/Admin");
const Aprendiz = require("../models/Aprendices");
const Instructores = require("../models/Instructor");
const enviarCorreo = require("../utils/enviarCorreo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const plantillasController = require("../controllers/templatesController");

// Función para iniciar sesión
exports.iniciarSesion = async (req, res, next) => {
  try {
    const { numero_documento, contrasena } = req.body;

    // Verificar si el número de documento y la contraseña están vacíos
    if (!numero_documento || !contrasena) {
      return res
        .status(400)
        .json({
          message: "El número de documento y la contraseña son requeridos",
        });
    }

    // Buscar al usuario por número de documento
    const usuario = await obtenerUsuarioPorNumeroDocumento(numero_documento);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT con el id, número de documento y rol del usuario
    const token = jwt.sign(
      {
        id_aprendiz: usuario.id_aprendiz,
        id_instructor: usuario.id_instructor,
        rol_usuario: usuario.rol_usuario,
        numero_documento: usuario.numero_documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        numero_ficha: usuario.numero_ficha,
      },
      process.env.TOKEN_SECRET_KEY || "SECRETKEY",
      {
        expiresIn: "4h",
      }
    );
    // Al final del inicio de sesión exitoso
    res.cookie("token", token, {
        // httpOnly: true, // Asegura que la cookie no sea accesible vía JavaScript
        secure: process.env.NODE_ENV === "production", // Solo se envía a través de HTTPS en producción
        sameSite: 'None' // Esto es necesario para que las cookies se envíen en solicitudes entre sitios
    });    
    // Enviar respuesta con token
    res.json({
      message: `Inicio de sesión exitoso como ${usuario.rol_usuario}`,
      token,
      usuario: {
        id_aprendiz: usuario.id_aprendiz,
        id_instructor: usuario.id_instructor,
        rol_usuario: usuario.rol_usuario,
        numero_documento: usuario.numero_documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        numero_ficha: usuario.numero_ficha,
      },
    });
  } catch (error) {
    // Mostrar error en consola en caso de error al inciar sesion.
    console.error("Error al iniciar sesión", error);
    // Mostar mensaje de error 500 si hubo error al procesar la solicitud.
    res
      .status(500)
      .json({ message: "Hubo un error al procesar la solicitud", error });
    // Continuar a la siguiente función después de error.
    next();
  }
};

// Función para obtener usuario por número de documento y rol
async function obtenerUsuarioPorNumeroDocumento(numero_documento) {
  let usuario;
  usuario = await Aprendiz.findOne({ where: { numero_documento } });
  if (!usuario) {
    usuario = await Admin.findOne({ where: { numero_documento } });
  }
  if (!usuario) {
    usuario = await Instructores.findOne({ where: { numero_documento } });
  }
  return usuario;
}

exports.logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

exports.verifyToken = async (req, res, next) => {
  try {
    // Verificar y decodificar el token
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY || "SECRETKEY"
    );

    // Obtener el token generado en el inicio de sesión
    const generatedToken = req.cookies.token;

    // Comparar el token enviado con el token generado
    if (token === generatedToken) {
      // Si los tokens coinciden, agregar el usuario al objeto de solicitud para su uso posterior
      req.usuario = decodedToken;
      // Continuar con el siguiente middleware
      next();
    } else {
      // Si los tokens no coinciden, devolver un error de autenticación
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    // Si hay algún error en la verificación del token, devolver un error de autenticación
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Objeto para almacenar temporalmente los códigos de verificación de restablecimiento de contraseña
const codigosVerificacion = {};

// Función para generar un código de verificación único
function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000); // Genera un código de 6 dígitos
}

// En el controlador de solicitud de restablecimiento de contraseña
exports.solicitarRestablecimientoContrasena = async (req, res, next) => {
  try {
    const { numero_documento, correo_electronico1 } = req.body;

    const usuario = await obtenerUsuarioPorNumeroDocumento(numero_documento);

    if (!usuario) {
      return res.status(404).json({ mensaje: "No se encontró ninguna cuenta asociada a este número de documento" });
    }

    if (!correo_electronico1) {
      return res.status(400).json({ mensaje: "El correo electrónico es requerido para restablecer la contraseña" });
    }

    const codigoVerificacion = generarCodigoVerificacion();
    const datosPlantilla = {
      nombreUsuario: usuario.nombres,
      codigoVerificacion
    };
    const cuerpoCorreo = plantillasController.cargarPlantillaResetPasswordRequest(datosPlantilla);

    await enviarCorreo(correo_electronico1, "S.E.E.P-Código de Verificación para Restablecimiento de Contraseña", cuerpoCorreo);

    codigosVerificacion[correo_electronico1] = { codigoVerificacion, usuario };

    res.json({ mensaje: "Se ha enviado un código de verificación al correo electrónico asociado a este usuario" });
  } catch (error) {
    console.error("Error al solicitar la recuperación de contraseña:", error);
    res.status(500).json({ mensaje: "Hubo un error al procesar la solicitud de restablecimiento de contraseña", error });
    next(error);
  }
};

// En el controlador authController.js
exports.verificarCorreoElectronico = async (req, res, next) => {
  try {
    const { rol_usuario, numero_documento, correo_electronico1 } = req.body;

    // Obtener el usuario por número de documento y rol
    const usuario = await obtenerUsuarioPorNumeroDocumento(
      numero_documento,
      rol_usuario
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si el correo electrónico coincide con el registrado
    if (usuario.correo_electronico1 !== correo_electronico1) {
      return res.json({ coincide: false });
    }

    // Si el correo electrónico coincide, devuelve true
    res.json({ coincide: true });
  } catch (error) {
    console.error("Error al verificar el correo electrónico:", error);
    res
      .status(500)
      .json({
        mensaje: "Hubo un error al verificar el correo electrónico",
        error,
      });
    next();
  }
};

// En el controlador de autenticación authController
exports.verificarCodigo = async (req, res, next) => {
  try {
    const { correo_electronico1, codigo_verificacion } = req.body;

    if (!codigosVerificacion[correo_electronico1] || codigosVerificacion[correo_electronico1].codigoVerificacion !== parseInt(codigo_verificacion)) {
      return res.status(400).json({ mensaje: "El código de verificación es incorrecto" });
    }

    res.json({ mensaje: "Código de verificación válido" });
  } catch (error) {
    console.error("Error al verificar el código de verificación:", error);
    res.status(500).json({ mensaje: "Hubo un error al verificar el código de verificación", error });
    next();
  }
};

// En el controlador de cambio de contraseña
exports.cambiarContrasena = async (req, res, next) => {
  try {
    const { correo_electronico1, codigo_verificacion, nueva_contrasena } = req.body;

    if (!codigosVerificacion[correo_electronico1] || codigosVerificacion[correo_electronico1].codigoVerificacion !== parseInt(codigo_verificacion)) {
      return res.status(400).json({ mensaje: "El código de verificación es incorrecto" });
    }

    const usuario = codigosVerificacion[correo_electronico1].usuario;
    const nuevaContrasenaCifrada = await bcrypt.hash(nueva_contrasena, 10);
    usuario.contrasena = nuevaContrasenaCifrada;
    await usuario.save();

    delete codigosVerificacion[correo_electronico1];

    const datosPlantilla = { nombreUsuario: usuario.nombres };
    const cuerpoCorreo = plantillasController.ChangePasswordTemplate(datosPlantilla);

    await enviarCorreo(correo_electronico1, "S.E.E.P-Contraseña Restablecida Exitosamente", cuerpoCorreo);

    res.json({ mensaje: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ mensaje: "Hubo un error al cambiar la contraseña", error });
    next();
  }
};
