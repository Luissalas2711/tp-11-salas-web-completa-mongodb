const mongoose = require("mongoose");
const conectarDB = require("../src/config/base-datos");

const comprobarConexion = async () => {
  try {
    await conectarDB();
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

comprobarConexion();
