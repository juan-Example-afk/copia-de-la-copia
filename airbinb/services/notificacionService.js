import { Notificacion } from '../models/entities/Notificacion.js';
import { ValidationError, NotFoundError } from "../errors/appError.js";

export class NotificacionService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const notificaciones = await this.repository.findAll();
    return notificaciones.map(n => n.toDTO());
  }

  async findByUsuario(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }
    const notificaciones = await this.repository.findByUsuario(usuarioId);
    return notificaciones.map(n => n.toDTO());
  }

  async findNoLeidas(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }
    const notificaciones = await this.repository.findNoLeidas(usuarioId);
    return notificaciones.map(n => n.toDTO());
  }

  async marcarComoLeida(id) {
    if (!id) {
      throw new ValidationError("El ID de notificación es requerido");
    }

    const notificacion = await this.repository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`No se encontró la notificación con ID ${id}`);
    }

    notificacion.marcarComoLeida();
    await this.repository.save(notificacion);
    return notificacion.toDTO();
  }

  async marcarTodasComoLeidas(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }
    
    const notificaciones = await this.repository.marcarTodasComoLeidas(usuarioId);
    return notificaciones.map(n => n.toDTO());
  }

  async crear(mensaje, usuario, reserva) {
    const notificacion = new Notificacion(mensaje, usuario, reserva);
    await this.repository.save(notificacion);
    return notificacion.toDTO();
  }
}