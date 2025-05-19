import { UsuarioController } from "../controllers/usuarioController.js";

export function registerUsuarioRoutes(app, getController) {
  app.get("/usuarios", (req, res, next) =>
    getController(UsuarioController).findAll(req, res, next)
  );

  app.get("/usuarios/:id", (req, res, next) =>
    getController(UsuarioController).findById(req, res, next)
  );

  app.post("/usuarios", (req, res, next) =>
    getController(UsuarioController).create(req, res, next)
  );

  app.put("/usuarios/:id", (req, res, next) =>
    getController(UsuarioController).update(req, res, next)
  );

  app.delete("/usuarios/:id", (req, res, next) =>
    getController(UsuarioController).delete(req, res, next)
  );
}