import { AlojamientoController } from "../controllers/alojamientoController.js";

export function registerAlojamientoRoutes(app, getController) {
  app.get("/alojamientos", (req, res,next) =>
    getController(AlojamientoController).findAll(req, res,next)
  );

  app.get("/alojamientos/:id", (req, res,next) =>
    getController(AlojamientoController).findById(req, res,next)
  );

  app.post("/alojamientos", (req, res,next) =>
    getController(AlojamientoController).create(req, res,next)
  );
}
