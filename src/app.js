const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { crearRouterReservas } = require("./rutas/reserva");
const { crearRouterApiReservas } = require("./rutas/api-reservas");

const crearApp = ({ controladorReservas, formatoRegistro }) => {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, `..`, "views"));
  app.set("layout", "layouts/main");

  app.use(morgan(formatoRegistro));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Inicio - Reservas de Salas" });
  });

  app.get("/estado", controladorReservas.obtenerEstado);

  app.use("/reservas", crearRouterReservas(controladorReservas));
  app.use("/api/reservas", crearRouterApiReservas(controladorReservas));

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La direccion solicitada no existe.",
    });
  });

  app.use((error, req, res, next) => {
    if (!req.path.startsWith("/api/")) {
      return next(error);
    }

    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      "body" in error
    ) {
      return res.status(400).json({ error: "JSON mal formado" });
    }

    return res.status(500).json({ error: "Error interno del servidor" });
  });

  return app;
};

module.exports = { crearApp };
