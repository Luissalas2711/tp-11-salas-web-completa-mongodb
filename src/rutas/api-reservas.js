const express = require("express");
const {
  validarApiReserva,
  validarCamposActualizacion,
} = require("../middleware/validar-api-reservas");

const crearRouterApiReservas = (controladorReservas) => {
  const router = express.Router();

  router.get("/", controladorReservas.listarApi);
  router.get("/:id", controladorReservas.obtenerApiPorId);
  router.post("/", validarApiReserva, controladorReservas.crearApi);
  router.put(
    "/:id",
    validarCamposActualizacion({ reemplazo: true }),
    controladorReservas.actualizarApi,
  );
  router.patch(
    "/:id",
    validarCamposActualizacion(),
    controladorReservas.actualizarApi,
  );
  router.delete("/:id", controladorReservas.eliminarApi);

  return router;
};

module.exports = { crearRouterApiReservas };
