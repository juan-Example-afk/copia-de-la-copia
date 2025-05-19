export class ReservaRepository {
  constructor() {
    this.reservas = [];
    this.currentId = 1;
  }

  async findAll() {
    return this.reservas;
  }

  async findById(id) {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.reservas.find(r => r.id === numId);
  }

  async findByUsuarioId(usuarioId) {
    return this.reservas.filter(r => r.huespedReservador?.email === usuarioId);
  }

  async save(reserva) {
    if (!reserva.id) {
      reserva.id = this.currentId++;
      this.reservas.push(reserva);
    } else {
      const index = this.reservas.findIndex(r => r.id === reserva.id);
      if (index !== -1) {
        this.reservas[index] = reserva;
      } else {
        this.reservas.push(reserva);
      }
    }
    return reserva;
  }

  async create(reserva) {
    return this.save(reserva);
  }

  async estaDisponible(idAlojamiento, fechaInicio, fechaFin, excluirId = null) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    return !this.reservas.some(r => {
      if (excluirId && r.id === excluirId) return false;
      if (r.idAlojamiento !== idAlojamiento) return false;
      if (r.estado === EstadoReserva.CANCELADA) return false;

      const rInicio = r.rangoFechas.fechaInicio;
      const rFin = r.rangoFechas.fechaFin;

      return (
        (inicio >= rInicio && inicio < rFin) ||
        (fin > rInicio && fin <= rFin) ||
        (inicio <= rInicio && fin >= rFin)
      );
    });
  }
}