const Empresa = require("../models/Empresa");
const Aprendices = require("../models/Aprendices");
// Controlador para registrar una empresa en  la base de datos.
exports.nuevaEmpresa = async (req, res, next) => {
  try {
    // Si la tabla no existe la crea, si existe la deja como está y no se peirden datos.
    await Empresa.sync({ force: false });

    const empresaExiste = await Empresa.findOne({
      where: {
        nit_empresa: req.body.nit_empresa,
      },
    });

    if (empresaExiste)
      return res
        .status(500)
        .json({ message: "La empresa ya se encuentra registarda" });
    const empresaData = req.body;

    const aprendiz = await Aprendices.findOne({
      where: {
        id_aprendiz: req.params.id_aprendiz,
      },
    });

    if (!aprendiz)
      return res.status(404).json({
        message: "No se ha encontardo el aprendiz con el id proporcionado",
      });

    // Crear la empresa y capturar el resultado
    const nuevaEmpresa = await Empresa.create(empresaData);

    // Asignar el id_empresa al aprendiz
    aprendiz.id_empresa = nuevaEmpresa.id_empresa;

    // Guardar los cambios en el aprendiz
    await aprendiz.save();

    res.status(201).json({
      message: "La empresa se ha registrado exitosamente",
      empresa: nuevaEmpresa,
    });
  } catch (error) {
    console.error("Error al registrar la empresa", error);
    res
      .status(500)
      .json({ message: "Hubo un error al registrar la empresa", error });
    next();
  }
};

// Controlador para obtener los datos de la empresa por el id de la empresa.
exports.obtenerDatosEmpresa = async (req, res) => {
  const id_empresa = req.params.id_empresa;
  if (!id_empresa)
    return res
      .status(500)
      .json({ message: "Debe proporcionar el id de la empresa" });
  try {
    const empresa = await Empresa.findOne({
      where: {
        id_empresa: id_empresa,
      },
    });
    if (!empresa)
      return res.status(404).json({
        message: "No se ha encontardo la empresa con el id proporciondo",
      });
    res.status(200).json({ empresa: empresa });
  } catch (error) {
    console.error("Hubo un error en  la solicitud", error);
    res.status(500).json({ message: "Hubo un error en la solicitud", error });
  }
};

// Función para obtener la empresa a la que pertenece un aprendiz.
exports.empresaAprendiz = async (req, res) => {
  try {
    // Consultar si existe el aprendiz con el id proporcionado en los parametros de la solicitud.
    const aprendiz = await Aprendices.findOne({
      where: {
        id_aprendiz: req.params.id_aprendiz,
      },
    });
    // Si el aprendiz no existe se envía un mensaje de error al usuario con código de estado 404 (No encontrado).
    if (!aprendiz)
      return res.status(404).json({
        message: "No se encontró el aprendiz con el id proporcionado",
      });
    // Se declara una constante que almacena el id de la empresa que está en los datos del aprendiz.
    const id_empresa_aprendiz = aprendiz.id_empresa;

    // Se hace una consulta a la base de datos para verificar si existe la empresa con el id_empresa que tiene el aprendiz.
    const empresa = await Empresa.findOne({
      where: {
        id_empresa: id_empresa_aprendiz,
      },
    });

    // Si la empresa no existe se envía un mensaje de error al usuario indicando que no se encontró la empresa.
    if (!empresa)
      return res
        .status(404)
        .json({ message: "No se encontró la empresa con el id proporcionado" });

    // Si la empresa existe se devuelve los datos de la empresa al usuario con un código de estado 200 (Todo salió bien).
    res.status(200).json({
      empresa,
    });
  } catch (error) {
    // Se muestra una respuesta en consola y al usuario en caso de error en el servidor al realizar la consulta.
    console.error("Hubo un error al obtener la empresa del Aprendiz", error);
    res
      .status(500)
      .json({
        message: "Hubo un error al obtener la empresa del Aprendiz",
        error,
      });
  }
};
