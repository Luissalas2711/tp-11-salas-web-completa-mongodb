const leerConfiguracion = (entorno = process.env) => {
  const puerto = entorno.PORT === undefined ? 3000 : Number(entorno.PORT);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error(`PORT debe ser un numero entero entre 1 y 65535.`);
  }

  const formatoRegistro =
    entorno.NODE_ENV === "production" ? "combined" : "dev";

  const mongodbUri = entorno.MONGODB_URI;

  return {
    puerto,
    formatoRegistro,
    mongodbUri,
  };
};

module.exports = leerConfiguracion();
