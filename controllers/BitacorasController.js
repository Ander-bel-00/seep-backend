// Importa el modelo de Bitacoras desde el archivo '../models/Bitacoras'
const Bitacoras = require("../models/Bitacoras");

// Importa el modelo de Aprendices desde el archivo '../models/Aprendices'
const Aprendices = require("../models/Aprendices");

// Importa el paquete 'multer' para gestionar la carga de archivos
const multer = require("multer");

// Importa el módulo 'fs' para trabajar con el sistema de archivos
const fs = require("fs");

// Importa el módulo 'path' para trabajar con rutas de archivos y directorios
const path = require("path");

// Configuración del almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  // Define la carpeta de destino para almacenar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../bitacoras/"));
  },
  // Define el nombre del archivo cuando se guarda en el sistema de archivos
  filename: function (req, file, cb) {
    // Normaliza el nombre del archivo eliminando caracteres especiales y espacios
    const filename = file.originalname.replace(/[^\w\s.-]/gi, "_");
    cb(null, filename);
  },
});

// Configuración de multer para el manejo de la carga de archivos
const upload = multer({
  // Define el almacenamiento para los archivos
  storage: storage,
  // Define un filtro de archivo para limitar los tipos de archivos permitidos
  fileFilter: function (req, file, cb) {
    // Lista de extensiones de archivo permitidas
    const allowedFileTypes = [".xls", ".xlsx", ".gsheet"];
    // Obtiene la extensión del archivo cargado y la convierte a minúsculas
    const fileExtension = path.extname(file.originalname).toLowerCase();
    console.log(`File extension: ${fileExtension}`); // Log de la extensión del archivo
    // Verifica si la extensión del archivo está incluida en la lista de tipos de archivo permitidos
    if (allowedFileTypes.includes(fileExtension)) {
      // Si la extensión está permitida, llama a la función de devolución de llamada con el indicador de que el archivo es válido
      cb(null, true);
    } else {
      console.log(`File rejected: ${file.originalname}`); // Log del archivo rechazado
      // Si la extensión no está permitida, llama a la función de devolución de llamada con un error
      cb(
        new Error(
          "Solo se permiten archivos de Excel o hojas de cálculo de Google"
        )
      );
    }
  },
}).single("archivo"); // Indica que solo se aceptará un archivo con el campo 'archivo' en el formulario

// Función para cargar una bitácora, que utiliza el middleware de multer llamado 'upload' para manejar la carga del archivo
exports.cargarBitacora = async (req, res, next) => {
  // Se ejecuta el middleware de multer para procesar la carga del archivo
  upload(req, res, async function (err) {
    // Si hay un error en la carga del archivo, devuelve una respuesta de error
    if (err) {
      console.log(err);
      return res.status(400).json({ mensaje: err.message });
    }

    try {
      // Primero sincroniza la tabla Bitacoras con la base de datos
      await Bitacoras.sync({ force: false });

      // Verificar si ya existe una bitácora con el mismo número para el mismo aprendiz
      const existingBitacora = await Bitacoras.findOne({
        where: {
          numero_de_bitacora: req.body.numero_de_bitacora,
          id_aprendiz: req.params.id_aprendiz,
        },
      });

      if (existingBitacora) {
        // Si ya existe una bitácora con el mismo número para este aprendiz, elimina el archivo subido y devuelve un mensaje de error
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          mensaje: "Ya se ha subido una bitácora con ese mismo número",
        });
      }

      // Busca al aprendiz correspondiente al ID proporcionado en la solicitud
      const aprendiz = await Aprendices.findOne({
        where: {
          id_aprendiz: req.params.id_aprendiz,
        },
      });

      // Si no se encuentra al aprendiz, devuelve un mensaje de error
      if (!aprendiz)
        return res.status(404).json({ mensaje: "El aprendiz no existe" });

      // Si no existe una bitácora con el mismo número para este aprendiz, procede a crearla y guardar el archivo
      const nuevaBitacora = {
        numero_de_bitacora: req.body.numero_de_bitacora,
        archivo: req.file.filename,
        id_aprendiz: aprendiz.id_aprendiz,
        intentos: 1, // Incrementa el contador a 1 para la primera carga
      };

      // Establece las observaciones como vacías después de crear la nueva bitácora
      nuevaBitacora.observaciones = "";

      // Crea la nueva bitácora en la base de datos
      await Bitacoras.create(nuevaBitacora);

      // Devuelve una respuesta con un mensaje de éxito y los detalles de la nueva bitácora
      return res.json({
        mensaje: "Bitácora cargada exitosamente",
        bitacora: nuevaBitacora,
      });
    } catch (error) {
      console.log(error);
      // Si ocurre un error durante el procesamiento de la bitácora, devuelve una respuesta de error
      return res
        .status(500)
        .json({ mensaje: "Error al procesar la bitácora", error: error });
    }
  });
};

// Función para obtener todas las bitácoras asociadas a un aprendiz específico
exports.obtenerBitacorasPorAprendiz = async (req, res) => {
  try {
    // Extrae el ID del aprendiz de los parámetros de la solicitud
    const { id_aprendiz } = req.params;

    // Busca todas las bitácoras asociadas al ID del aprendiz
    const bitacoras = await Bitacoras.findAll({
      where: { id_aprendiz },
    });

    // Verifica si no se encontraron bitácoras asociadas al aprendiz y devuelve un mensaje de error si es así
    if (bitacoras.length === 0) {
      res
        .status(404)
        .json({ mensaje: "No hay bitacoras cargadas por ese aprendiz" });
    } else {
      // Si se encontraron bitácoras asociadas al aprendiz, devuelve un estado 200 con las bitácoras encontradas
      res.status(200).json({ bitacoras });
    }
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error al cliente
    console.error("Error al obtener las bitacoras del aprendiz:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para obtener todas las bitácoras registradas
exports.obtenerBitacoras = async (req, res, next) => {
  try {
    // Busca todas las bitácoras en la base de datos
    const bitacoras = await Bitacoras.findAll();

    // Verifica si no se encontraron bitácoras y devuelve un mensaje de error si es así
    if (bitacoras.length < 0)
      return res.status(404).json({ message: "No hay bitacoras registradas" });

    // Si se encontraron bitácoras, devuelve un estado 200 con las bitácoras encontradas
    res.status(200).json({
      bitacoras: bitacoras,
    });
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error al cliente
    console.error("Error al obtener las bitacoras", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para descargar una bitácora
exports.descargarBitacora = async (req, res) => {
  try {
    // Obtener el nombre del archivo desde los parámetros de la solicitud
    const nombreArchivo = req.params.nombreArchivo;

    // Construir la ruta del archivo utilizando el directorio de bitácoras y el nombre del archivo
    const rutaArchivo = path.join(__dirname, "../bitacoras", nombreArchivo);

    // Verificar si el archivo existe en la ruta especificada
    if (!fs.existsSync(rutaArchivo)) {
      // Si el archivo no existe, devuelve un estado 404 con un mensaje de error
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Si el archivo existe, lo envía como respuesta para su descarga
    res.download(rutaArchivo);
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error al cliente
    console.error("Error al descargar el archivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para enviar observaciones a una bitácora
exports.enviarObservacion = async (req, res) => {
  try {
    // Obtener el ID de la bitácora desde los parámetros de la solicitud
    const { id_bitacora } = req.params;
    // Obtener las observaciones del cuerpo de la solicitud
    const { observaciones } = req.body;

    // Buscar la bitácora por su ID
    const bitacora = await Bitacoras.findByPk(id_bitacora);

    // Verificar si la bitácora existe
    if (!bitacora) {
      // Si la bitácora no existe, devuelve un estado 404 con un mensaje de error
      return res.status(404).json({ mensaje: "La bitácora no existe" });
    }

    // Actualizar las observaciones de la bitácora con las proporcionadas en la solicitud
    bitacora.observaciones = observaciones;
    // Guardar los cambios en la base de datos
    await bitacora.save();

    // Devolver un estado 200 con un mensaje de éxito
    return res
      .status(200)
      .json({ mensaje: "Observaciones enviadas correctamente" });
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error adecuado
    console.error("Error al enviar observaciones:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Función para aprobar una bitácora
exports.aprobarBitacora = async (req, res) => {
  try {
    // Obtener el ID de la bitácora desde los parámetros de la solicitud
    const { idBitacora } = req.params;

    // Buscar la bitácora por su ID
    const bitacora = await Bitacoras.findByPk(idBitacora);

    // Verificar si la bitácora existe
    if (!bitacora) {
      // Si la bitácora no existe, devuelve un estado 404 con un mensaje de error
      return res.status(404).json({ mensaje: "La bitácora no existe" });
    }

    // Cambiar el estado de aprobación de la bitácora a true
    bitacora.estado = true;
    // Borrar las observaciones asociadas a la bitácora
    bitacora.observaciones = "";
    // Guardar los cambios en la base de datos
    await bitacora.save();

    // Devolver un estado 200 con un mensaje de éxito
    return res.status(200).json({ mensaje: "Bitácora aprobada correctamente" });
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error adecuado
    console.error("Error al aprobar la bitácora:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Función para actualizar una bitácora
exports.actualizarBitacora = async (req, res) => {
  try {
    // Obtener el ID de la bitácora desde los parámetros de la solicitud
    const { idBitacora } = req.params;

    // Buscar la bitácora por su ID
    const bitacora = await Bitacoras.findByPk(idBitacora);

    // Verificar si la bitácora existe
    if (!bitacora) {
      // Si la bitácora no existe, devuelve un estado 404 con un mensaje de error
      return res.status(404).json({ mensaje: "La bitácora no existe" });
    }

    // Verificar si la bitácora tiene observaciones
    if (!bitacora.observaciones || bitacora.observaciones.trim() === "") {
      // Si la bitácora no tiene observaciones, devuelve un estado 400 con un mensaje de error
      return res.status(400).json({
        mensaje:
          "La bitácora no tiene observaciones, por lo que no puede ser actualizada",
      });
    }

    // Procesar la carga del archivo
    upload(req, res, async function (err) {
      if (err) {
        // Si hay un error durante el proceso de carga del archivo, devuelve un estado 400 con un mensaje de error
        return res.status(400).json({ mensaje: err.message });
      }

      // Eliminar el archivo antiguo si existe
      const filePath = path.join(__dirname, "../bitacoras/", bitacora.archivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Actualizar los datos de la bitácora con los valores de la solicitud o mantener los valores anteriores si no se proporcionan nuevos valores
      bitacora.numero_de_bitacora =
        req.body.numero_de_bitacora || bitacora.numero_de_bitacora;
      bitacora.archivo = req.file.filename; // Utilizar el nombre del archivo cargado
      bitacora.intentos += 1; // Incrementa el contador en cada actualización
      // Establecer las observaciones como vacías después de la actualización
      bitacora.observaciones = "";

      // Guardar los cambios en la base de datos
      await bitacora.save();

      // Devolver un estado 200 con un mensaje de éxito y los datos de la bitácora actualizada
      return res
        .status(200)
        .json({ mensaje: "Bitácora actualizada correctamente", bitacora });
    });
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error y devuelve un mensaje de error adecuado
    console.error("Error al actualizar la bitácora:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Función para eliminar una bitácora
exports.eliminarBitacora = async (req, res, next) => {
  try {
    // Buscar la bitácora por su ID
    const bitacora = await Bitacoras.findByPk(req.params.id_bitacora);

    // Verificar si la bitácora existe
    if (!bitacora) {
      // Si la bitácora no existe, devuelve un estado 404 con un mensaje de error
      return res.status(404).json({ mensaje: "La bitácora no existe" });
    }

    // Eliminar la bitácora de la base de datos
    await bitacora.destroy();

    // Eliminar el archivo de la carpeta bitacoras
    const filePath = path.join(__dirname, "../bitacoras/", bitacora.archivo);
    fs.unlinkSync(filePath);

    // Devolver un estado 200 con un mensaje de éxito
    return res.json({ mensaje: "Bitácora eliminada exitosamente" });
  } catch (error) {
    // Si ocurre un error durante el proceso, devuelve un estado 500 con un mensaje de error
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar la bitácora", error: error });
  }
};
