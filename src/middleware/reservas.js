const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

const asignarSeccion = (req, res, next) => {
  res.locals.seccion = `Reservas de salas`;
  next();
};

const validarReserva = (req, res, next) => {
  const cuerpo = req.body || {};
  const estudiante = cuerpo.estudiante ? cuerpo.estudiante.trim() : "";
  const email = cuerpo.email ? cuerpo.email.trim() : "";
  const sala = cuerpo.sala ? cuerpo.sala.trim() : "";
  const fecha = cuerpo.fecha ? cuerpo.fecha.trim() : "";
  const turno = cuerpo.turno ? cuerpo.turno.trim() : "";
  const personasRaw = cuerpo.personas;
  const personas =
    personasRaw === undefined || personasRaw === ""
      ? NaN
      : Number.parseInt(personasRaw, 10);

  const errores = [];

  if (!estudiante) errores.push("El nombre del estudiante es obligatorio.");
  if (!fecha) errores.push("La fecha es obligatoria.");

  if (!sala || !salasPermitidas.includes(sala)) {
    errores.push("Debe seleccionar una sala válida.");
  }

  if (!turno || !turnosPermitidos.includes(turno)) {
    errores.push("Debe seleccionar un turno válido.");
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push("La cantidad de personas debe ser un entero entre 1 y 6.");
  }

  if (!email || !email.includes("@")) {
    errores.push("El email debe contener un @.");
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      salasPermitidas,
      errores,
      valores: {
        estudiante,
        email,
        sala,
        fecha,
        turno,
        personas: cuerpo.personas,
      },
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
};

module.exports = {
  salasPermitidas,
  turnosPermitidos,
  asignarSeccion,
  validarReserva,
};
