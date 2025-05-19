export class CambioEstadoReserva {
  constructor(estadoReserva, reserva, motivo, usuario) {
    this.fecha = new Date();
    this.estadoReserva = estadoReserva;
    this.reserva = reserva;
    this.motivo = motivo;
    this.usuario = usuario;
  }
}
