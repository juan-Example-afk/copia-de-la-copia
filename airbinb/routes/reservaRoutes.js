import { ReservaController } from "../controllers/reservaController.js";

export function registerReservaRoutes(app, getController) {
  app.get("/reservas", (req, res, next) =>
    getController(ReservaController).findAll(req, res, next)
  );

  app.get("/reservas/:id", (req, res, next) =>
    getController(ReservaController).findById(req, res, next)
  );

  app.post("/reservas", (req, res, next) =>
    getController(ReservaController).create(req, res, next)
  );

  app.put("/reservas/:id", (req, res, next) =>
    getController(ReservaController).modificar(req, res, next)
  );

  app.delete("/reservas/:id", (req, res, next) =>
    getController(ReservaController).cancelar(req, res, next)
  );

  app.get("/usuarios/:id/reservas", (req, res, next) =>
    getController(ReservaController).historialPorUsuario(req, res, next)
  );

  app.patch("/reservas/:id/estado", (req, res, next) =>
    getController(ReservaController).actualizarEstado(req, res, next)
  );
}