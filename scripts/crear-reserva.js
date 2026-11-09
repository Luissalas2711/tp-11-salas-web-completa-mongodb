const mongoose = require("mongoose");
const conectarDB = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

const crearReserva = async () => {
  try {
    await conectarDB();
    const nuevaReserva = new Reserva({
      estudiante: "Juan Pérez",
      email: "juan.perez@example.com",
      sala: "Sala Norte",
      fecha: "2026-06-12",
      turno: "Mañana",
      personas: "2",
    });
    await nuevaReserva.save();
    console.log("Reserva creada con ID:", nuevaReserva._id);
  } catch (error) {
    console.error("Error al crear la reserva:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

crearReserva();
