const mongoose = require("mongoose");
const conectarDB = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

const listarReservas = async () => {
  try {
    await conectarDB();
    const reservas = await Reserva.find();
    console.log("Reservas encontradas:");

    reservas.forEach((reserva) => {
      console.log({
        _id: reserva._id.toString(),
        estudiante: reserva.estudiante,
        email: reserva.email,
        sala: reserva.sala,
        fecha: reserva.fecha,
        turno: reserva.turno,
        personas: reserva.personas,
      });
    });

    console.log(`Cantidad recuperada: ${reservas.length}`);
  } catch (error) {
    console.error("Error al listar las reservas:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

listarReservas();
