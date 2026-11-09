const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, "El campo estudiante es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El campo email es obligatorio"],
      trim: true,
      match: [/@/, "El email debe contener un @"],
    },
    sala: {
      type: String,
      required: [true, "El campo sala es obligatorio"],
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    },
    fecha: {
      type: String,
      required: [true, "El campo fecha es obligatorio"],
      trim: true,
    },
    turno: {
      type: String,
      required: [true, "El campo turno es obligatorio"],
      enum: ["Mañana", "Tarde", "Noche"],
    },
    personas: {
      type: Number,
      required: [true, "El campo personas es obligatorio"],
      min: [1, "El número de personas debe ser al menos 1"],
      max: [6, "El número de personas no puede exceder 6"],
      validate: {
        validator: Number.isInteger,
        message: "El número de personas debe ser un número entero",
      },
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
  },
  {
    collection: "reservas",
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
