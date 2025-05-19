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
    if (this.leida) {
      throw new Error("La notificación ya está marcada como leída");
    }
    
    this.leida = true;
    this.fechaLeida = new Date();
  }

  pertenece(usuario) {
    return this.usuario.email === usuario.email;
  }
}