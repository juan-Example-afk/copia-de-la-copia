export class NotificacionRepository {
  constructor() {
    this.notificaciones = [];
    this.nextId = 1;
  }

  async save(notificacion) {
    if (!notificacion.id) {
      notificacion.id = this.nextId++;
    }
    const index = this.notificaciones.findIndex(n => n.id === notificacion.id);
    if (index !== -1) {
      this.notificaciones[index] = notificacion;
    } else {
      this.notificaciones.push(notificacion);
    }
    return notificacion;
  }

  async findByUsuario(usuarioEmail) {
    return this.notificaciones.filter(n => n.usuario.email === usuarioEmail);
  }

  async findNoLeidas(usuarioEmail) {
    return this.notificaciones.filter(n => n.usuario.email === usuarioEmail && !n.leida);
  }

  async marcarTodasComoLeidas(usuarioEmail) {
    const noLeidas = await this.findNoLeidas(usuarioEmail);
    for (const notificacion of noLeidas) {
      notificacion.marcarComoLeida();
      await this.save(notificacion);
    }
    return noLeidas;
  }

  async findAll() {
    return this.notificaciones;
  }

  async findById(id) {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.notificaciones.find(n => n.id === numId);
  }
}