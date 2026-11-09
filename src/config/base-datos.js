const config = require(`./entorno`);
const mongoose = require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const conectarDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Conexión a la base de datos establecida");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = conectarDB;
