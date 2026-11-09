const reserva = require("../modelos/reserva");

const crearServicioReserva = () => {
  const ordenamientos = {
    estudiante: { estudiante: 1, _id: 1 },
    "personas-asc": { personas: 1, _id: 1 },
    "personas-desc": { personas: -1, _id: 1 },
  };

  const crearFiltro = (sala) => (sala ? { sala } : {});

  const listar = async (sala, orden = "estudiante") =>
    reserva.find(crearFiltro(sala)).sort(ordenamientos[orden]);

  const listarPaginado = async (sala, orden, pagina, limite) => {
    const filtro = crearFiltro(sala);

    const [datos, total] = await Promise.all([
      reserva
        .find(filtro)
        .select("estudiante email sala fecha turno personas estado")
        .sort(ordenamientos[orden])
        .skip((pagina - 1) * limite)
        .limit(limite),
      reserva.countDocuments(filtro),
    ]);

    const datosPublicos = datos.map((item) => ({
      id: item._id.toString(),
      estudiante: item.estudiante,
      email: item.email,
      sala: item.sala,
      fecha: item.fecha,
      turno: item.turno,
      personas: item.personas,
      estado: item.estado,
    }));

    return {
      datos: datosPublicos,
      pagina,
      limite,
      total,
      paginas: Math.ceil(total / limite),
    };
  };

  const buscarPorId = async (id) => {
    const resultados = await reserva.find({ _id: id });
    return resultados[0];
  };

  const obtenerCantidad = async () => (await reserva.find({})).length;

  const crear = async (datos) => reserva.create(datos);

  const actualizarPorId = async (id, datos) =>
    reserva.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
      upsert: false,
    });

  const reemplazar = async (id, datos) =>
    reserva.findOneAndReplace({ _id: id }, datos, {
      returnDocument: "after",
      runValidators: true,
      upsert: false,
    });

  const eliminarPorId = async (id) => reserva.findByIdAndDelete(id);

  return {
    listar,
    listarPaginado,
    buscarPorId,
    obtenerCantidad,
    crear,
    actualizarPorId,
    reemplazar,
    eliminarPorId,
  };
};

module.exports = { crearServicioReserva };
