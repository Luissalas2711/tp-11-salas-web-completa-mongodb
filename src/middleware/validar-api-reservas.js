const { salasPermitidas, turnosPermitidos } = require("./reservas");

const validarApiReserva = (req, res, next) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo) ||
    Object.keys(cuerpo).length === 0
  ) {
    return res
      .status(400)
      .json({ error: "El body debe ser un objeto JSON con datos" });
  }

  const estudiante =
    typeof cuerpo.estudiante === "string" ? cuerpo.estudiante.trim() : "";
  const email = typeof cuerpo.email === "string" ? cuerpo.email.trim() : "";
  const sala = typeof cuerpo.sala === "string" ? cuerpo.sala.trim() : "";
  const fecha = typeof cuerpo.fecha === "string" ? cuerpo.fecha.trim() : "";
  const turno = typeof cuerpo.turno === "string" ? cuerpo.turno.trim() : "";
  const personas = cuerpo.personas;

  if (!estudiante) {
    return res.status(400).json({ error: "El estudiante es obligatorio" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "El email debe contener un @" });
  }

  if (!salasPermitidas.includes(sala)) {
    return res.status(400).json({ error: "La sala no está permitida" });
  }

  if (!turnosPermitidos.includes(turno)) {
    return res.status(400).json({ error: "El turno no está permitido" });
  }

  if (!fecha) {
    return res.status(400).json({ error: "La fecha es obligatoria" });
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    return res
      .status(400)
      .json({ error: "Personas debe ser un entero entre 1 y 6" });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
};

const camposEditables = [
  "estudiante",
  "email",
  "sala",
  "fecha",
  "turno",
  "personas",
  "estado",
];

const validarCamposActualizacion = ({ reemplazo = false } = {}) => {
  return (req, res, next) => {
    const cuerpo = req.body;

    if (
      !cuerpo ||
      typeof cuerpo !== "object" ||
      Array.isArray(cuerpo) ||
      Object.keys(cuerpo).length === 0
    ) {
      return res
        .status(400)
        .json({ error: "El body debe ser un objeto JSON con datos" });
    }

    const camposDesconocidos = Object.keys(cuerpo).filter(
      (campo) => !camposEditables.includes(campo),
    );

    if (camposDesconocidos.length > 0) {
      return res.status(400).json({
        error: `Campos desconocidos: ${camposDesconocidos.join(", ")}`,
      });
    }

    if (reemplazo) {
      const camposFaltantes = camposEditables.filter(
        (campo) => !Object.hasOwn(cuerpo, campo),
      );

      if (camposFaltantes.length > 0) {
        return res.status(400).json({
          error: `Faltan campos: ${camposFaltantes.join(", ")}`,
        });
      }
    }

    const camposValidados = { ...cuerpo };

    for (const campo of [
      "estudiante",
      "email",
      "sala",
      "fecha",
      "turno",
      "estado",
    ]) {
      if (!Object.hasOwn(camposValidados, campo)) continue;

      if (typeof camposValidados[campo] !== "string") {
        return res.status(400).json({ error: `${campo} debe ser texto` });
      }

      camposValidados[campo] = camposValidados[campo].trim();

      if (!camposValidados[campo]) {
        return res.status(400).json({ error: `${campo} es obligatorio` });
      }
    }

    if (
      Object.hasOwn(camposValidados, "email") &&
      !camposValidados.email.includes("@")
    ) {
      return res.status(400).json({ error: "El email debe contener un @" });
    }

    if (
      Object.hasOwn(camposValidados, "sala") &&
      !salasPermitidas.includes(camposValidados.sala)
    ) {
      return res.status(400).json({ error: "La sala no está permitida" });
    }

    if (
      Object.hasOwn(camposValidados, "turno") &&
      !turnosPermitidos.includes(camposValidados.turno)
    ) {
      return res.status(400).json({ error: "El turno no está permitido" });
    }

    if (Object.hasOwn(camposValidados, "personas")) {
      const valor = camposValidados.personas;

      if (typeof valor !== "number" && typeof valor !== "string") {
        return res
          .status(400)
          .json({ error: "Personas tiene un formato inválido" });
      }

      const numero = Number(typeof valor === "string" ? valor.trim() : valor);

      if (!Number.isInteger(numero) || numero < 1 || numero > 6) {
        return res
          .status(400)
          .json({ error: "Personas debe ser un entero entre 1 y 6" });
      }

      camposValidados.personas = numero;
    }

    if (
      Object.hasOwn(camposValidados, "estado") &&
      !["pendiente", "confirmada"].includes(camposValidados.estado)
    ) {
      return res.status(400).json({ error: "El estado no está permitido" });
    }

    req.camposActualizacion = camposValidados;
    next();
  };
};

module.exports = { validarApiReserva, validarCamposActualizacion };
