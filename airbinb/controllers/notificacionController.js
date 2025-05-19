import { ValidationError } from "../errors/appError.js";

export class NotificacionController {
  constructor(notificacionService) {
    this.notificacionService = notificacionService;
  }

  async findAll(req, res, next) {
    try {
      const notificaciones = await this.notificacionService.findAll();
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  }

  async findByUsuario(req, res, next) {
    try {
      const usuarioId = req.params.id;
      const notificaciones = await this.notificacionService.findByUsuario(usuarioId);
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  }

  async findNoLeidas(req, res, next) {
    try {
      const usuarioId = req.params.id;
      const notificaciones = await this.notificacionService.findNoLeidas(usuarioId);
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  }

  async marcarComoLeida(req, res, next) {
    try {
      const id = Number(req.params.id);
      await this.notificacionService.marcarComoLeida(id);
      res.status(200).json({ mensaje: "Notificación marcada como leída" });
    } catch (error) {
      next(error);
    }
  }

  async marcarTodasComoLeidas(req, res, next) {
    try {
      const usuarioId = req.params.id;
      await this.notificacionService.marcarTodasComoLeidas(usuarioId);
      res.status(200).json({ mensaje: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
      next(error);
    }
  }
}