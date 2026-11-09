const { crearServicioReserva } = require("./servicios/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearApp } = require("./app");
const config = require("./config/entorno");
const conectarDB = require("./config/base-datos");
const mongoose = require("mongoose");

const servicioReservas = crearServicioReserva();
const controladorReservas = crearControladorReservas(servicioReservas);
const app = crearApp({
  controladorReservas,
  formatoRegistro: config.formatoRegistro,
});

const iniciarServidor = async () => {
  await conectarDB();

  const servidor = app.listen(config.puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
  });

  let cerrando = false;

  const cerrarServidor = () => {
    if (cerrando) {
      return;
    }

    cerrando = true;

    servidor.close(async (error) => {
      if (error) {
        console.error("Error al cerrar el servidor:", error);
        process.exitCode = 1;
      }

      try {
        await mongoose.connection.close();
        console.log("Servidor y conexión a MongoDB cerrados");
      } catch (error) {
        console.error("Error al cerrar MongoDB:", error);
        process.exitCode = 1;
      }
    });
  };

  process.on("SIGINT", cerrarServidor);
  process.on("SIGTERM", cerrarServidor);
};

iniciarServidor();
