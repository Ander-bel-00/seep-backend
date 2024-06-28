// Importa el modelo de Documentos desde el archivo "../models/Documentos.js".
const Documentos = require("../models/Documentos");

// Importa el modelo de Aprendices desde el archivo "../models/Aprendices.js".
const Aprendices = require("../models/Aprendices");

// Importa el módulo 'multer' para manejar la subida de archivos.
const multer = require("multer");

// Importa el módulo 'fs' para trabajar con el sistema de archivos (file system).
const fs = require("fs");

// Importa el módulo 'path' para trabajar con rutas de archivo y directorio.
const path = require("path");

// Configura el almacenamiento para los archivos subidos, especificando la carpeta de destino y el nombre de archivo.
const storage = multer.diskStorage({
  // Esta función define la carpeta de destino donde se guardarán los archivos subidos.
  destination: function (req, file, cb) {
    // Llama a la función de devolución de llamada (callback) 'cb' para indicar la carpeta de destino donde se guardarán los archivos subidos.
    // 'null' indica que no hay errores.
    // 'path.join(__dirname, '../uploads/')' concatena el directorio actual (__dirname) con la carpeta 'uploads' para obtener la ruta completa de destino.
    cb(null, path.join(__dirname, "../uploads/"));
  },
  // Esta función define el nombre del archivo que se guardará en el servidor.
  filename: function (req, file, cb) {
    // Normaliza el nombre del archivo eliminando caracteres especiales y espacios
    const filename = file.originalname.replace(/[^\w\s.-]/gi, "_");
    cb(null, filename);
  },
});

// Configuración de multer para el manejo de la carga de archivos
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = [".pdf"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    console.log(`File extension: ${fileExtension}`); // Log de la extensión del archivo
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      console.log(`File rejected: ${file.originalname}`); // Log del archivo rechazado
      cb(new Error("Solo se permiten archivos en PDF"));
    }
  },
}).single("archivo");


// Exporta una función asincrónica llamada cargarDocumento que recibe los objetos req (solicitud) y res (respuesta).
exports.cargarDocumento = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ mensaje: err.message });
      }

      const { tipo_documento } = req.body;
      await Documentos.sync({ force: false });

      const aprendiz = await Aprendices.findOne({
        where: {
          id_aprendiz: req.params.id_aprendiz,
        },
      });

      if (!aprendiz) {
        fs.unlinkSync(req.file.path); // Eliminar el archivo si el aprendiz no existe
        return res.status(404).json({ mensaje: "El aprendiz no existe" });
      }

      // Verificar si el tipo de documento ya ha sido subido
      const documentoExistente = await Documentos.findOne({
        where: {
          id_aprendiz: req.params.id_aprendiz,
          tipo_documento: tipo_documento,
        },
      });

      if (documentoExistente) {
        fs.unlinkSync(req.file.path); // Eliminar el archivo si el tipo de documento ya existe
        return res.status(400).json({
          mensaje: `Ya se subió un archivo para el tipo de documento: ${tipo_documento}`,
        });
      }

      const nuevoDocumento = await Documentos.create({
        tipo_documento,
        archivo: req.file.filename,
        id_aprendiz: aprendiz.id_aprendiz,
      });

      res.status(201).json({
        message: "Documento cargado exitosamente",
        documento: nuevoDocumento,
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cargar el documento", error: error.message });
  }
};

// Exporta una función asincrónica llamada obtenerDocumentosPorAprendiz que recibe los objetos req (solicitud) y res (respuesta).
exports.obtenerDocumentosPorAprendiz = async (req, res) => {
  try {
    // Extrae el ID del aprendiz de los parámetros de la solicitud.
    const { id_aprendiz } = req.params;

    // Busca todos los documentos en la base de datos que estén asociados al ID del aprendiz.
    const documentos = await Documentos.findAll({
      where: { id_aprendiz },
    });

    // Devuelve una respuesta de estado 200 (éxito) con los documentos encontrados.
    res.status(200).json({ documentos });
  } catch (error) {
    // Si ocurre un error durante el proceso, imprime un mensaje de error en la consola y devuelve una respuesta de estado 500 (error interno del servidor).
    console.error("Error al obtener los documentos del aprendiz:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función asincrónica para obtener todos los documentos registrados en la Base de datos.
exports.obtenerDocumentos = async (req, res, next) => {
  try {
    // Se Busca todos los documentos disponibles en la base de datos en la tabla Documentos.
    const documentos = await Documentos.findAll();

    // Si hay menos de un documento mostrar un mensaje de error.
    if (documentos.length < 0)
      // Retornar un mensaje de error con código de estado 404 (No encontrado) en caso de no encontrar documentos.
      return res.status(404).json({ message: "No hay documentos registrados" });
    // Si se encuentran documentos mostrarlos con un código de estado 200 (éxito).
    res.status(200).json({
      // Objeto json que retorna los documentos encontrados.
      documentos: documentos,
    });
  } catch (error) {
    // Mostrar mensaje en consola en caso de error al buscar los documentos.
    console.error("Error al obtener los documentos", error);
    // Mostrar respuesta de error con código 500 (error interno del servidor).
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Exporta una función asincrónica llamada descargarDocumento que recibe los objetos req (solicitud) y res (respuesta).
exports.descargarDocumento = async (req, res) => {
  try {
    // Obtiene el nombre del archivo de los parámetros de la solicitud.
    const nombreArchivo = req.params.nombreArchivo;

    // Concatena la ruta del directorio de carga de archivos con el nombre del archivo para obtener la ruta completa del archivo.
    const rutaArchivo = path.join(__dirname, "../uploads", nombreArchivo);

    // Verifica si el archivo existe en la ruta especificada.
    if (!fs.existsSync(rutaArchivo)) {
      // Si el archivo no existe, devuelve una respuesta de estado 404 (no encontrado) con un mensaje indicando que el archivo no fue encontrado.
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Si el archivo existe, envía el archivo como respuesta de la solicitud de descarga.
    res.download(rutaArchivo);
  } catch (error) {
    // Si ocurre un error durante el proceso, imprime un mensaje de error en la consola y devuelve una respuesta de estado 500 (error interno del servidor).
    console.error("Error al descargar el archivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Ruta para eliminar un documento por su ID
exports.eliminarDocumento = async (req, res, next) => {
  try {
    // Obtener el ID del documento a eliminar
    const { id_documento } = req.params;

    // Buscar el documento en la base de datos por su ID
    const documento = await Documentos.findByPk(id_documento);

    // Verificar si el documento existe
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Eliminar el archivo de la carpeta de uploads
    eliminarArchivo(documento.archivo);

    // Eliminar el documento de la base de datos
    await documento.destroy();

    // Enviar respuesta con código de estado 200 (éxito) al eliminar el documento.
    res.status(200).json({ message: "Documento eliminado exitosamente" });
  } catch (error) {
    // Mostrar mensaje de error en consola en caso de error al eliminar un documento.
    console.error("Error al eliminar el documento:", error);
    // Envíar una respuesta con código 500 (error interno del servidor) en caso de no poder eliminar el documento.
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para eliminar un archivo de la carpeta de uploads
const eliminarArchivo = (nombreArchivo) => {
  // Construye la ruta completa del archivo utilizando el nombre del archivo y la ruta del directorio de uploads.
  const rutaArchivo = path.join(__dirname, "../uploads", nombreArchivo);

  // Utiliza fs.unlink para eliminar el archivo de la ruta especificada.
  fs.unlink(rutaArchivo, (error) => {
    // Si hay un error al eliminar el archivo, imprime un mensaje de error en la consola.
    if (error) {
      console.error("Error al eliminar el archivo:", error);
    } else {
      // Si se elimina el archivo correctamente, imprime un mensaje de éxito en la consola.
      console.log("Archivo eliminado exitosamente");
    }
  });
};
