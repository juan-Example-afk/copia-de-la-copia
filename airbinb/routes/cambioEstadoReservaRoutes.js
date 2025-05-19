import { CambioEstadoReservaController } from "../controllers/cambioEstadoReservaController.js";

export function registerCambioEstadoReservaRoutes(app, getController) {
  app.get("/cambios-reserva", (req, res, next) =>
    getController(CambioEstadoReservaController).findAll(req, res, next)
  );

  app.get("/cambios-reserva/:idReserva", (req, res) =>
    getController(CambioEstadoReservaController).findByReserva(req, res, next)
  );
}
