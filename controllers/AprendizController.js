const Aprendices = require("../models/Aprendices");
const enviarCorreo = require("../utils/enviarCorreo");
const plantillasController = require("../controllers/templatesController");
const Fichas = require("../models/Fichas");
const bcrypt = require("bcryptjs");
const {generarContrasenaAleatoria} = require('./ContraseñaAleatoria');
const {
  Sequelize,
  ValidationError: SequelizeValidationError,
} = require("sequelize");


exports.nuevoAprendiz = async (req, res, next) => {
  try {
    const { correo_electronico1, correo_electronico_sofia_plus } = req.body;

    // Verificar si el correo electrónico ya está registrado
    const correoExistente = await Aprendices.findOne({
      where: { correo_electronico1, correo_electronico_sofia_plus }
    });

    if (correoExistente) {
      return res.status(400).json({
        mensaje: "El correo electrónico ya está registrado"
      });
    }

    // Generar una contraseña aleatoria
    const contrasenaAleatoria = generarContrasenaAleatoria();

    // Validar la longitud de la contraseña antes de encriptarla
    if (contrasenaAleatoria.length < 8) {
      return res.status(400).json({
        mensaje: "La contraseña generada no cumple con los requisitos de longitud",
      });
    }

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasenaAleatoria, 10);
    req.body.contrasena = hashedPassword;

    // Buscar la ficha correspondiente al número de ficha proporcionado
    const ficha = await Fichas.findOne({
      where: { numero_ficha: req.body.numero_ficha }
    });

    // Si no se encuentra la ficha, retornar un error
    if (!ficha) {
      return res.status(404).json({
        mensaje: "No se encontró la ficha correspondiente al número proporcionado",
      });
    }

    await Aprendices.sync({ force: false });

    // Crear el aprendiz con los datos de la ficha
    const aprendizData = {
      ...req.body,
      contrasena_temporal: true,
    };

    // Verificar si el aprendiz existe antes de crearlo.
    const aprendizExistente = await Aprendices.findOne({
      where: { numero_documento: req.body.numero_documento }
    });

    // Si el aprendiz existe me envia un mensaje de error, de lo contrario me crea el aprendiz.
    if (aprendizExistente) {
      return res.status(400).json({ mensaje: "El aprendiz ya se encuentra registrado" });
    }

    // Crear el aprendiz en la base de datos
    const aprendiz = await Aprendices.create(aprendizData);

    const datosPlantilla = {
      nombreUsuario: aprendiz.nombres,
      numeroDocumento: aprendiz.numero_documento,
      contrasenaUsuario: contrasenaAleatoria,
    };
    const cuerpoCorreo = plantillasController.RegisterAprendiz(datosPlantilla);

    await enviarCorreo(
      correo_electronico1,
      "S.E.E.P-Bienvenido al Sistema de Evaluación de Etapa Productiva",
      cuerpoCorreo
    );

    // Enviar mensaje de respuesta con los datos del aprendiz creado.
    res.json({
      mensaje: "El aprendiz ha sido registrado exitosamente",
      aprendiz,
    });
  } catch (error) {
    console.error("Error al crear un nuevo aprendiz", error);
    if (error instanceof SequelizeValidationError) {
      const errores = error.errors.map((e) => e.message);
      return res.status(400).json({ mensaje: "Hubo un error al validar los datos", errores });
    }
    res.status(500).json({ mensaje: "Hubo un error al procesar la solicitud", error });
    next();
  }
};


// Obtener los datos de todos los aprendices almacenados en la base de datos.
exports.mostrarAprendices = async (req, res, next) => {
  try {
    // Obtener el usuario del objeto de solicitud
    const { rol_usuario, numero_documento } = req.usuario;

    // Verificar si el usuario es un aprendiz
    if (rol_usuario === "aprendiz") {
      // Si el usuario es un aprendiz, mostrar solo su información
      const aprendiz = await Aprendices.findOne({
        where: {
          numero_documento: numero_documento,
        },
      });
      // Devolver la información del aprendiz en un JSON
      return res.json(aprendiz);
    }

    // Si el usuario no es un aprendiz, obtener todos los aprendices
    const aprendices = await Aprendices.findAll({});
    // Devolver todos los aprendices en un JSON
    res.json(aprendices);
  } catch (err) {
    // En caso de error, enviar un mensaje y los detalles del error al usuario
    console.error(err);
    res.status(500).json({ mensaje: "error en la solicitud", error: err });
    next();
  }
};

// Obtener un aprendiz almacenado en la base de datos por medio de su número de documento.
exports.mostrarAprendizByDocument = async (req, res) => {
  try {
    // Obtener el numero de documento enviado en la cabecera de la solicitud.
    const documento = req.params.numero_documento;

    // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
    const aprendiz = await Aprendices.findOne({
      where: {
        numero_documento: documento,
      },
    });
    // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
    if (!aprendiz) {
      return res
        .status(404)
        .json({ mensaje: "No se ha encontrado ese aprendiz", aprendiz });
    }
    // Si encuentra el aprendiz lo muestra en un JSON.
    res.json(aprendiz);
  } catch (error) {
    // En caso de error envía un mensaje y los detalles del error al usuario.
    res.status(500).json(error);
  }
};

// Obtener un aprendiz almacenado en la base de datos por medio de su ID.
exports.AprendizPorID = async (req, res) => {
  try {
    // Obtener el ID enviado en la cabecera de la solicitud.
    const id_aprendiz = req.params.id_aprendiz;

    // Comparar si el ID enviado es igual al almacenado en la base de datos.
    const aprendiz = await Aprendices.findOne({
      where: {
        id_aprendiz: id_aprendiz,
      },
    });
    // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
    if (!aprendiz) {
      return res
        .status(404)
        .json({ mensaje: "No se ha encontrado ese aprendiz", aprendiz });
    }
    // Si encuentra el aprendiz lo muestra en un JSON.
    res.json(aprendiz);
  } catch (error) {
    // En caso de error envía un mensaje y los detalles del error al usuario.
    res.status(500).json(error);
  }
};

// Actualizar los datos de un aprendiz registrado en la base de datos.
exports.actualizarAprendiz = async (req, res, next) => {
  try {
    // Obtener el numero de documento enviado en la cabecera de la solicitud.
    const documento = req.params.numero_documento;

    // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
    const aprendizExistente = await Aprendices.findOne({
      where: {
        numero_documento: documento,
      },
    });

    // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
    if (!aprendizExistente) {
      return res
        .status(404)
        .json({ mensaje: "No se ha encontrado ese aprendiz", aprendiz });
    }

    // Si el aprendiz es encontrado se podrá actualizar sus datos.
    const aprendizActualizado = await aprendizExistente.update(req.body);

    // Se envía al usuario un JSON con el aprendiz y sus datos actualizados.
    res.json({
      mensaje: "el aprendiz se ha actualizado correctamente",
      aprendiz: aprendizActualizado,
    });
  } catch (err) {
    // En caso de error envía un mensaje y los detalles del error al usuario.
    res.status(500).json(err);
  }
};

// Eliminar un aprendiz almacenado en la base de datos por medio de su número de documento.
exports.eliminarAprendiz = async (req, res) => {
  // Obtener el numero de documento enviado en la cabecera de la solicitud.
  const documento = req.params.numero_documento;

  // Comparar si el numero de documento enviado es igual al almacenado en la base de datos.
  const Aprendiz = await Aprendices.findOne({
    where: {
      numero_documento: documento,
    },
  });

  // En caso de no encontrar el aprendiz envía un mensaje de error al usuario.
  if (!Aprendiz) {
    return res
      .status(404)
      .json({ mensaje: "No se ha encontrado ese aprendiz", Aprendiz });
  }

  // Si el aprendiz se encuentra podrá eliminarse correctamente.
  const eliminarAprendiz = await Aprendices.destroy({
    where: {
      numero_documento: documento,
    },
  });

  // Envía mensaje al usuario si el aprendiz se ha eliminado correctamente.
  res
    .status(200)
    .json({ mensaje: "El aprendiz ha sido eliminado correctamente" });
};

exports.aprendizContrasena = async (req, res, next) => {
  try {
    const aprendiz = await Aprendices.findOne({
      where: {
        id_aprendiz: req.params.id_aprendiz,
      },
    });
    if (!aprendiz)
      return res
        .status(404)
        .json({
          menssage: "No se ha encontardo el aprendiz con el id proporcionado",
        });
    const nuevaContrasena = req.body.contrasena;

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    aprendiz.contrasena = hashedPassword;
    aprendiz.contrasena_temporal = false;

    await aprendiz.save();
    res.status(200).json({
        message: 'Su contraseña se ha actualizado exitosamente'
    });
  } catch (error) {
    console.error('Hubo un error al actualizar la contraseña', error);
    res.status(500).json({
        message: 'Hubo un error al actualizar la contraseña',
        error
    });
  }
};


