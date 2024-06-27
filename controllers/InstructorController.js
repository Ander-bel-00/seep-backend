const Instructores = require("../models/Instructor");
const Fichas = require("../models/Fichas");
const bcrypt = require("bcryptjs");
const {
  Sequelize,
  ValidationError: SequelizeValidationError,
} = require("sequelize");
const { generarContrasenaAleatoria } = require("./ContraseñaAleatoria");
const enviarCorreo = require("../utils/enviarCorreo");
const plantillasController = require("../controllers/templatesController");

exports.nuevoInstructor = async (req, res, next) => {
  try {
    // Generar una contraseña aleatoria
    const contrasenaAleatoria = generarContrasenaAleatoria();

    // Validar la longitud de la contraseña antes de encriptarla
    if (contrasenaAleatoria.length < 8) {
      return res.status(400).json({
        mensaje:
          "La contraseña generada no cumple con los requisitos de longitud",
      });
    }

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasenaAleatoria, 10);
    req.body.contrasena = hashedPassword;

    const numerosFicha = req.body.fichas_asignadas;
    const fichas = await Fichas.findAll({
      where: {
        numero_ficha: numerosFicha,
      },
    });

    // Si no se encuentran las fichas, retornar un error
    if (!fichas || fichas.length !== numerosFicha.length) {
      return res.status(404).json({
        mensaje:
          "No se encontraron todas las fichas correspondientes a los números proporcionados",
      });
    }

    await Instructores.sync({ force: false });

    const instructorData = {
      ...req.body,
      contrasena_temporal: true,
      // Convertir el array de números de ficha en una cadena separada por comas
      fichas_asignadas: fichas.map((ficha) => ficha.numero_ficha).join(","),
    };

    // Verificar si el instructor existe antes de crearlo
    const instructorExistente = await Instructores.findOne({
      where: {
        numero_documento: req.body.numero_documento,
      },
    });

    // Si el instructor existe, enviar un mensaje de error; de lo contrario, crear el instructor
    if (instructorExistente) {
      res
        .status(500)
        .json({ mensaje: "El instructor ya se encuentra registrado" });
    } else {
      const correo_electronico1 = req.body.correo_electronico1;
      // Crear el instructor en la base de datos
      const instructor = await Instructores.create(instructorData);

      const datosPlantilla = {
        nombreUsuario: instructor.nombres,
        numeroDocumento: instructor.numero_documento,
        contrasenaUsuario: contrasenaAleatoria,
      };
      const cuerpoCorreo =
        plantillasController.RegisterAprendiz(datosPlantilla);

      await enviarCorreo(
        correo_electronico1,
        "S.E.E.P-Bienvenido al Sistema de Evaluación de Etapa Productiva",
        cuerpoCorreo
      );

      // Enviar mensaje de respuesta con los datos del instructor creado
      res.json({
        mensaje: "El instructor ha sido registrado exitosamente",
        instructor,
      });
    }
  } catch (error) {
    console.error("Error al crear un nuevo instructor", error);
    // Aquí verificamos si el error es una instancia de SequelizeValidationError
    if (error instanceof SequelizeValidationError) {
      // Extraemos los mensajes de error y los enviamos al cliente
      const errores = error.errors.map((e) => e.message);
      return res
        .status(400)
        .json({ mensaje: "Hubo un error al validar los datos", errores });
    }
    res
      .status(500)
      .json({ mensaje: "Hubo un error al procesar la solicitud", error });
    next();
  }
};

// Obtener todas las fichas asociadas a un instructor.
exports.obtenerFichasAsignadas = async (req, res, next) => {
  try {
    // Obtener el número de documento del instructor de los parámetros de la solicitud
    const { numero_documento } = req.params;

    // Buscar al instructor por su número de documento
    const instructor = await Instructores.findOne({
      where: {
        numero_documento,
      },
    });

    // Si no se encuentra al instructor, enviar un mensaje de error
    if (!instructor) {
      return res.status(404).json({ mensaje: "Instructor no encontrado" });
    }

    // Obtener los números de ficha asignados al instructor
    const numerosFichaAsignados = instructor.fichas_asignadas;

    // Buscar las fichas correspondientes a los números de ficha asignados
    const fichasAsignadas = await Fichas.findAll({
      where: {
        numero_ficha: numerosFichaAsignados,
      },
    });

    // Enviar las fichas asignadas como respuesta
    res.json({ fichasAsignadas });
  } catch (error) {
    console.error(
      "Error al obtener las fichas asignadas del instructor",
      error
    );
    res
      .status(500)
      .json({ mensaje: "Hubo un error al procesar la solicitud", error });
    next();
  }
};

exports.obtenerInstructores = async (req, res, next) => {
  try {
    const instructores = await Instructores.findAll();
    if (instructores) {
      // Mostrar todos los instructores registrados.
      res.status(200).json(instructores);
    } else {
      // Mensaje en caso de no encontrar ni un instructor en la BD.
      res.status(404).json({ mensaje: "No hay Instructores registrados" });
    }
  } catch (error) {
    // Mostrar mensaje si hubo error interno en el servidor.
    console.error(error);
    res.status(500).json(error);
  }
};

// Obtener un Instructor por el ID.
exports.obtenerInstructorById = async (req, res, next) => {
  try {
    const idInstructor = req.params.id_instructor;
    if (idInstructor) {
      const instructor = await Instructores.findOne({
        where: {
          id_instructor: idInstructor,
        },
      });

      res.status(200).json(instructor);
    } else {
      res.status(404).json({ mensaje: "No se encuentra el instructor" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo error interno en el servidor" });
  }
};

// Obtener un Instructor por número de ficha asignada.
exports.obtenerInstructorByFicha = async (req, res, next) => {
  try {
    const numero_ficha = req.params.numero_ficha;

    // Buscar un instructor cuya fichas_asignadas contenga el número de ficha buscado

    /*[Sequelize.Op.like]: Indica que quieres realizar una búsqueda donde la columna fichas_asignadas 
    contenga una subcadena que coincida con el valor de numero_ficha.
    %${numero_ficha}%: Es la cadena de búsqueda donde % es un comodín que indica que 
    puede haber cualquier número de caracteres (incluyendo ninguno) antes y después 
    de numero_ficha. Esto permite buscar cualquier valor de fichas_asignadas que 
    contenga numero_ficha en cualquier posición de la cadena. */
    const instructor = await Instructores.findOne({
      where: {
        fichas_asignadas: {
          [Sequelize.Op.like]: `%${numero_ficha}%`,
        },
      },
    });

    if (!instructor) {
      return res.status(404).json({ mensaje: "No se encuentra el instructor" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    console.error("Hubo error al obtener el instructor por ficha", error);
    res.status(500).json({ mensaje: "Hubo error interno en el servidor" });
  }
};

// Actualizar datos de un Instructor.
exports.actualizarInstructor = async (req, res, next) => {
  try {
    const idInstructor = req.params.id_instructor;
    const instructor = await Instructores.findOne({
      where: {
        id_instructor: idInstructor,
      },
    });
    if (!instructor) {
      return res.status(404).json({ mensaje: "Instructor no encontrado" });
    }

    // Verificar si fichas_asignadas es un array, si no lo es, convertirlo en uno
    const fichasAsignadas = Array.isArray(req.body.fichas_asignadas)
      ? req.body.fichas_asignadas
      : [req.body.fichas_asignadas];

    // Actualizar el instructor con el nuevo valor de fichas_asignadas
    const instructorActualizado = await instructor.update({
      fichas_asignadas: fichasAsignadas,
    });

    res.status(200).json({
      mensaje: "Instructor actualizado exitosamente",
      instructorActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo error interno en el servidor" });
  }
};

exports.eliminarInstructor = async (req, res, next) => {
  try {
    const idInstructor = req.params.id_instructor;

    if (idInstructor) {
      const instructor = await Instructores.findOne({
        where: {
          id_instructor: idInstructor,
        },
      });

      const eliminarInstructor = instructor.destroy();

      res
        .status(200)
        .json({ mensaje: "El instructor ha sido eliminado correctamente" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Hubo error interno en el servidor" });
  }
};

exports.nueaContrasenaInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructores.findOne({
      where: {
        id_instructor: req.params.id_instructor,
      },
    });

    if (!instructor)
      return res.status(404).json({
        menssage: "No se ha encontardo el instructor con el id proporcionado",
      });

    const nuevaContrasena = req.body.contrasena;

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    instructor.contrasena = hashedPassword;
    instructor.contrasena_temporal = false;

    await instructor.save();
    res.status(200).json({
      message: "Su contraseña se ha actualizado exitosamente",
    });
  } catch (error) {
    console.error("Hubo un error al actualizar la contraseña", error);
    res.status(500).json({
      message: "Hubo un error al actualizar la contraseña",
      error,
    });
  }
};
