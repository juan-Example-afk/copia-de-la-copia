import { NotificacionController } from "../controllers/notificacionController.js";

export function registerNotificacionRoutes(app, getController) {
  app.get("/notificaciones", (req, res, next) =>
    getController(NotificacionController).findAll(req, res, next)
  );

  app.get("/notificaciones/usuario/:id", (req, res, next) =>
    getController(NotificacionController).findByUsuario(req, res, next)
  );

  app.get("/notificaciones/no-leidas/:id", (req, res, next) =>
    getController(NotificacionController).findNoLeidas(req, res, next)
  );

  app.patch("/notificaciones/:id/leer", (req, res, next) =>
    getController(NotificacionController).marcarComoLeida(req, res, next)
  );

  app.patch("/notificaciones/usuario/:id/leer-todas", (req, res, next) =>
    getController(NotificacionController).marcarTodasComoLeidas(req, res, next)
  );
}