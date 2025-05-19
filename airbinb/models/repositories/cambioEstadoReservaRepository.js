export class CambioEstadoReservaRepository {
  constructor() {
    this.cambios = [];
    this.nextId = 1;
  }

  async findByReserva(reserva) {
    return this.cambios.filter(c => c.reserva.idReserva === reserva.idReserva);
  }

  async findAll() {
    return this.cambios;
  }
}
