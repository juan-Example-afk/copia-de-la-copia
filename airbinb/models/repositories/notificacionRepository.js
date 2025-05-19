export class NotificacionRepository {
  constructor() {
    this.notificaciones = [];
    this.nextId = 1; // opcional, si quieres asignar ids
  }

  async save(notificacion) {
    if (!notificacion.id) {
      notificacion.id = this.nextId++;
    }
    this.notificaciones.push(notificacion);
    return notificacion;
  }

  async findByUsuario(usuario) {
    return this.notificaciones.filter(n => n.usuario.email === usuario.email);
  }

  async findNoLeidas(usuario) {
    const todas = await this.findByUsuario(usuario);
    return todas.filter(n => !n.leida);
  }

  async marcarTodasComoLeidas(usuario) {
    const noLeidas = await this.findNoLeidas(usuario);
    noLeidas.forEach(n => n.marcarComoLeida());
  }

  async findAll() {
    return this.notificaciones;
  }

  async findById(id) {
    return this.notificaciones.find(n => n.id === id);
  }
}
