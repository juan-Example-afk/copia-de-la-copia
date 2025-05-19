export class Notificacion {
  constructor(mensaje, usuario, reserva) {
    if (!mensaje || !usuario) {
      throw new Error("Mensaje y usuario son campos requeridos");
    }
    
    this.id = null; // Se asignará al persistir
    this.mensaje = mensaje;
    this.usuario = usuario;
    this.reserva = reserva;
    this.fechaCreacion = new Date();
    this.leida = false;
    this.fechaLeida = null;
  }

  marcarComoLeida() {
    if (!this.leida) {
      this.leida = true;
      this.fechaLeida = new Date();
    }
    return this;
  }

  pertenece(usuario) {
    return this.usuario.email === usuario.email;
  }

  toDTO() {
    return {
      id: this.id,
      mensaje: this.mensaje,
      usuario: this.usuario.email,
      reserva: this.reserva?.id,
      fechaCreacion: this.fechaCreacion,
      leida: this.leida,
      fechaLeida: this.fechaLeida
    };
  }
}