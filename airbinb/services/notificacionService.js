import { Notificacion } from '../models/entities/Notificacion.js';
import { ValidationError, NotFoundError } from "../errors/appError.js";

export class NotificacionService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const notificaciones = await this.repository.findAll();
    if (!Array.isArray(notificaciones)) {
      throw new Error("El repositorio no devolvió una lista de notificaciones");
    }
    return notificaciones.map(this.toDTO);
  }

  async findLeidasByUsuario(idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
      throw new ValidationError("El ID de usuario proporcionado no es válido");
    }
    const allNotificaciones = await this.repository.findByUsuario(idUsuario);
    const leidas = allNotificaciones.filter(n => n.leida);
    return leidas.map(this.toDTO);
  }

  async findNoLeidasByUsuario(idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
      throw new ValidationError("El ID de usuario proporcionado no es válido");
    }
    const allNotificaciones = await this.repository.findByUsuario(idUsuario);
    const noLeidas = allNotificaciones.filter(n => !n.leida);
    return noLeidas.map(this.toDTO);
  }

  async marcarComoLeida(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("El ID de notificación proporcionado no es válido");
    }

    const notificacion = await this.repository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`No se encontró notificación con ID ${id}`);
    }

    notificacion.marcarComoLeida();
    await this.repository.save(notificacion); // asumiendo que hay un método save para persistir cambios
    return this.toDTO(notificacion);
  }

  toDTO(notificacion) {
    return {
      id: notificacion.id,
      mensaje: notificacion.mensaje,
      usuario: notificacion.usuario?.id ?? null,
      leida: notificacion.leida,
      fechaLeida: notificacion.fechaLeida,
    };
  }
}
