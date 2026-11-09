const { salasPermitidas } = require("../middleware/reservas");

const crearControladorReservas = (servicio) => {
  const listarReservas = async (req, res) => {
    res.render("reservas/lista", {
      titulo: "Listado de Reservas",
      reservas: await servicio.listar(),
    });
  };

  const listarApi = async (req, res) => {
    try {
      let sala = req.query.sala;

      if (sala !== undefined && typeof sala !== "string") {
        return res
          .status(400)
          .json({ error: "El parámetro sala no puede repetirse" });
      }

      if (sala !== undefined) {
        sala = sala.trim();

        if (!sala) {
          return res
            .status(400)
            .json({ error: "La sala no puede estar vacía" });
        }
      }

      const orden = req.query.orden ?? "estudiante";
      const ordenesPermitidos = ["estudiante", "personas-asc", "personas-desc"];

      if (!ordenesPermitidos.includes(orden)) {
        return res
          .status(400)
          .json({ error: "El parámetro orden no es válido" });
      }

      const paginaTexto = req.query.pagina ?? "1";
      const limiteTexto = req.query.limite ?? "2";

      if (
        typeof paginaTexto !== "string" ||
        paginaTexto.trim() === "" ||
        typeof limiteTexto !== "string" ||
        limiteTexto.trim() === ""
      ) {
        return res
          .status(400)
          .json({ error: "Pagina y limite deben ser numeros validos" });
      }

      const pagina = Number(paginaTexto);
      const limite = Number(limiteTexto);

      if (
        !Number.isInteger(pagina) ||
        pagina < 1 ||
        pagina > 1000 ||
        !Number.isInteger(limite) ||
        limite < 1 ||
        limite > 20
      ) {
        return res
          .status(400)
          .json({ error: "Página o límite fuera del rango permitido" });
      }

      if (req.query.select !== undefined) {
        return res
          .status(400)
          .json({ error: "El parámetro select no está permitido" });
      }

      const resultado = await servicio.listarPaginado(
        sala,
        orden,
        pagina,
        limite,
      );
      return res.status(200).json(resultado);
    } catch {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  const formularioEditarReserva = async (req, res) => {
    const id = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).render("no-encontrado", {
        titulo: "ID inválido",
        mensaje: "El ID de la reserva no es válido.",
      });
    }
    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: `No se encontró la reserva con ID ${req.params.id}`,
      });
    }

    res.render("reservas/editar", {
      titulo: "Editar Reserva",
      reserva,
      errores: [],
      valores: {
        estudiante: reserva.estudiante,
        email: reserva.email,
        sala: reserva.sala,
        turno: reserva.turno,
        personas: reserva.personas,
        estado: reserva.estado,
      },
    });
  };

  const obtenerApiPorId = async (req, res) => {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const reserva = await servicio.buscarPorId(id);

      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      return res.status(200).json(reserva);
    } catch {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  const crearApi = async (req, res) => {
    try {
      const reserva = await servicio.crear(req.reservaValidada);

      return res
        .status(201)
        .location(`/api/reservas/${reserva._id}`)
        .json(reserva);
    } catch {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  const actualizarApi = async (req, res) => {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID invalido" });
    }

    try {
      const reservaActualizada = await servicio.actualizarPorId(
        id,
        req.camposActualizacion,
      );

      if (!reservaActualizada) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      return res.status(200).json(reservaActualizada);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ error: "Los datos de la reserva no son válidos" });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  const eliminarApi = async (req, res) => {
    const id = req.params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      const reservaEliminada = await servicio.eliminarPorId(id);

      if (!reservaEliminada) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }

      return res.status(204).end();
    } catch {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  const formularioNuevaReserva = (req, res) => {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      salasPermitidas,
      errores: [],
      valores: {},
    });
  };

  const guardarEdicionReserva = async (req, res) => {
    const id = req.params.id;
    const { estudiante, email, sala, fecha, turno, personas, estado } =
      req.body;

    const errores = [];

    const estudianteLimpio = (estudiante || "").trim();
    const emailLimpio = (email || "").trim();
    const fechaLimpia = (fecha || "").trim();
    const salaLimpia = (sala || "").trim();
    const turnoLimpio = (turno || "").trim();

    const personasNumero =
      personas === undefined || personas === ""
        ? NaN
        : Number.parseInt(personas, 10);

    if (!estudianteLimpio)
      errores.push("El nombre del estudiante es obligatorio.");
    if (!emailLimpio || !emailLimpio.includes("@")) {
      errores.push("El email debe contener un @.");
    }
    if (!fechaLimpia) errores.push("La fecha es obligatoria.");
    if (!["Sala Norte", "Sala Sur", "Sala Multimedia"].includes(salaLimpia)) {
      errores.push("Debe seleccionar una sala válida.");
    }
    if (!["Mañana", "Tarde", "Noche"].includes(turnoLimpio)) {
      errores.push("Debe seleccionar un turno válido.");
    }
    if (
      !Number.isInteger(personasNumero) ||
      personasNumero < 1 ||
      personasNumero > 6
    ) {
      errores.push("La cantidad de personas debe ser un entero entre 1 y 6.");
    }

    if (errores.length > 0) {
      return res.status(400).render("reservas/editar", {
        titulo: "Editar reserva",
        reserva: { _id: id },
        errores,
        valores: {
          estudiante: estudianteLimpio,
          email: emailLimpio,
          sala: salaLimpia,
          fecha: fechaLimpia,
          turno: turnoLimpio,
          personas: personasNumero,
          estado: estado || "pendiente",
        },
      });
    }

    await servicio.reemplazar(id, {
      estudiante: estudianteLimpio,
      email: emailLimpio,
      sala: salaLimpia,
      fecha: fechaLimpia,
      turno: turnoLimpio,
      personas: personasNumero,
      estado: ["pendiente", "confirmada"].includes(estado)
        ? estado
        : "pendiente",
    });

    return res.redirect(303, "/reservas");
  };

  const obtenerReservaPorId = async (req, res) => {
    const id = req.params.id;
    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: `No se encontró la reserva con ID ${req.params.id}`,
      });
    }

    res.render("reservas/detalle", { titulo: "Detalle de Reserva", reserva });
  };

  const crearReserva = async (req, res) => {
    await servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  };

  const obtenerEstado = async (req, res) => {
    res.json({
      servicio: "activo",
      reservas: await servicio.obtenerCantidad(),
      solicitudId: res.locals.solicitudId,
    });
  };

  return {
    listarReservas,
    formularioNuevaReserva,
    formularioEditarReserva,
    guardarEdicionReserva,
    obtenerReservaPorId,
    crearReserva,
    obtenerEstado,
    listarApi,
    obtenerApiPorId,
    crearApi,
    actualizarApi,
    eliminarApi,
  };
};

module.exports = { crearControladorReservas };
