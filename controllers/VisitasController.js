const Visitas = require("../models/Visita");
const Aprendices = require("../models/Aprendices");
const moment = require("moment");
const { Op } = require("sequelize");
const enviarCorreo = require("../utils/enviarCorreo");
const plantillasController = require("../controllers/templatesController");
const Instructores = require("../models/Instructor");
const {
  Sequelize,
  ValidationError: SequelizeValidationError,
} = require("sequelize");


exports.crearEvento = async (req, res) => {
  const id_aprendiz = req.params.id_aprendiz;
  const {
    tipo_visita,
    fecha,
    hora_inicio,
    hora_fin,
    lugar_visita,
    modalidad_visita,
    estado,
  } = req.body;

  try {
    await Visitas.sync({ force: false });
    const aprendices = await Aprendices.findOne({
      where: { id_aprendiz: id_aprendiz },
    });

    if (aprendices) {
      // Verificar si hay una visita agendada en el mismo día con horas posteriores
      const visitaPrevia = await Visitas.findOne({
        where: {
          aprendiz: id_aprendiz,
          fecha: fecha,
          estado: "activo",
        },
      });

      if (visitaPrevia) {
        return res.status(400).json({
          error:
            "No se pueden agendar varias visitas en un día a un mismo aprendiz",
        });
      }

      // Verificar si hay una visita agendada en la misma fecha y hora que otra visita existente
      const visitaExistente = await Visitas.findOne({
        where: {
          fecha: fecha, // Filtra visitas que tengan la misma fecha que la nueva visita
          [Op.or]: [
            // Usa el operador OR para combinar múltiples condiciones lógicas
            {
              hora_inicio: { [Op.lte]: hora_inicio }, // Verifica si la hora de inicio de una visita existente es menor o igual a la hora de inicio de la nueva visita
              hora_fin: { [Op.gte]: hora_inicio }, // Verifica si la hora de fin de una visita existente es mayor o igual a la hora de inicio de la nueva visita
            }, // Si ambas condiciones son verdaderas, significa que la nueva visita empieza durante una visita existente
            {
              hora_inicio: { [Op.lte]: hora_fin }, // Verifica si la hora de inicio de una visita existente es menor o igual a la hora de fin de la nueva visita
              hora_fin: { [Op.gte]: hora_fin }, // Verifica si la hora de fin de una visita existente es mayor o igual a la hora de fin de la nueva visita
            }, // Si ambas condiciones son verdaderas, significa que la nueva visita termina durante una visita existente
            {
              hora_inicio: { [Op.gte]: hora_inicio }, // Verifica si la hora de inicio de una visita existente es mayor o igual a la hora de inicio de la nueva visita
              hora_fin: { [Op.lte]: hora_fin }, // Verifica si la hora de fin de una visita existente es menor o igual a la hora de fin de la nueva visita
            }, // Si ambas condiciones son verdaderas, significa que la nueva visita se superpone completamente con una visita existente
          ],
          estado: "activo",
        },
      });

      if (visitaExistente) {
        return res.status(400).json({
          error:
            "Ya existe una visita agendada en este horario para otro aprendiz, Verifica que la hora de inicio y la hora de finalización de la visita no esté en el rango de una visita de otro aprendiz para este mismo día.",
        });
      }

      const correo_electronico1 = aprendices.correo_electronico1;

      // Formatear la fecha y la hora usando moment.js
      const fechaFormateada = moment(fecha)
        .locale("es")
        .format("D [de] MMMM [de] YYYY");
      const horaInicioFormateada = moment(hora_inicio, "HH:mm").format(
        "hh:mm A"
      );

      const datosPlantilla = {
        nombreUsuario: aprendices.nombres,
        tipoVisita: tipo_visita,
        fechaVisita: fechaFormateada,
        horainicio: horaInicioFormateada,
      };

      const cuerpoCorreo =
        plantillasController.VisitasPlantilla(datosPlantilla);

      await enviarCorreo(
        correo_electronico1,
        "S.E.E.P-Le informamos que se le ha sido agendada una visita",
        cuerpoCorreo
      );

      // Permitir la creación de la nueva visita si no hay visitas del mismo tipo para el aprendiz en cualquier fecha
      const nuevaVisita = await Visitas.create({
        tipo_visita: tipo_visita,
        fecha,
        hora_inicio,
        hora_fin,
        lugar_visita,
        modalidad_visita,
        estado: "activo", // Establecer el estado como activo al crear la visita
        aprendiz: id_aprendiz,
      });

      return res.json(nuevaVisita);
    } else {
      res.status(404).json({ mensaje: "No se encontró el aprendiz" });
    }
  } catch (error) {
    console.error("Error creando el evento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los eventos del calendario
exports.obtenerEventos = async (req, res) => {
  try {
    const visitas = await Visitas.findAll(); // utiliza el modelo Calendar en la BD
    res.status(201).json({
      visitas: visitas,
    }); // método findAll para recuperar eventos almacenados en la BD
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.obtenerEventosAprendiz = async (req, res) => {
  try {
    // Pasa un id por la url
    const idAprendiz = req.params.id_aprendiz;
    const visitas = await Visitas.findAll({
      where: {
        aprendiz: idAprendiz,
        estado: "activo",
      },
    });
    if (visitas) {
      res.status(200).json({
        visitas: visitas,
      });
    } else {
      res.status(404).json({
        mensaje: "No se pudo encontrar visitas",
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

exports.actualizarEventos = async (req, res) => {
  try {
    const idVisita = req.params.id_visita;
    const visita = await Visitas.findOne({
      where: {
        id_visita: idVisita,
      },
    });
    if (visita) {
      const actualizarVisita = await visita.update(req.body);
      res.status(200).json({
        visitaActualizada: actualizarVisita,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

exports.eliminarEvento = async (req, res) => {
  try {
    const idVisita = req.params.id_visita;
    const visita = await Visitas.findOne({
      where: {
        id_visita: idVisita,
      },
    });
    if (visita) {
      const eliminarVisita = await visita.destroy();
      res.json({ mensaje: "La visita se ha eliminado" });
    }
  } catch (error) {
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

exports.cancelarEvento = async (req, res) => {
  try {
    const idVisita = req.params.id_visita;
    const { motivo_cancelacion } = req.body;

    const visita = await Visitas.findOne({
      where: { id_visita: idVisita },
    });

    const aprendiz = await Aprendices.findOne({
      where: {
        id_aprendiz: visita.aprendiz,
      },
    });

    const instructor = await Instructores.findOne({
      where: {
        fichas_asignadas: {
          [Sequelize.Op.like]: `%${aprendiz.numero_ficha}%`,
        },
      },
    });

    if (visita) {
      visita.motivo_cancelacion = motivo_cancelacion;
      visita.estado = "cancelado";
      const correo_electronico1 = aprendiz.correo_electronico1;

      const datosPlantilla = {
        nombreUsuario: aprendiz.nombres,
        nombreInstructor: instructor.nombres,
        tipoVisita: visita.tipo_visita,
        motivo_cancelacion: visita.motivo_cancelacion,
        correoInstructor: instructor.correo_electronico1
      };
      const cuerpoCorreo =
        plantillasController.CancelarVisitaPlantilla(datosPlantilla);

      await enviarCorreo(
        correo_electronico1,
        "S.E.E.P-Su visita ha sido cancelada",
        cuerpoCorreo
      );
      
      await visita.save();

      res.json({ mensaje: "La visita se ha cancelado" });
    } else {
      res.status(404).json({ mensaje: "Visita no encontrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
