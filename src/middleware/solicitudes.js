let numeroDeSolicitudes = 0;

const identificarSolicitud = (req, res, next) => {
  numeroDeSolicitudes += 1;
  res.locals.solicitudId = `BIB-${String(numeroDeSolicitudes).padStart(4, "0")}`;
  next();
};

const medirDuracion = (req, res, next) => {
  const inicio = process.hrtime.bigint();
  res.on("finish", () => {
    const duracion = Number(process.hrtime.bigint() - inicio) / 1_000_000;
    console.log(
      `Duración de la solicitud ${res.locals.solicitudId}: ${duracion.toFixed(2)} ms`,
    );
  });
  next();
};

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
