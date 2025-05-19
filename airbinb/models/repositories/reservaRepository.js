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
    return this.reservas.filter(r => r.huespedReservador.email === usuarioId);
  }

  async save(reserva) {
    if (!reserva.id) {
      reserva.id = this.currentId++;
      this.reservas.push(reserva);
    } else {
      const index = this.reservas.findIndex(r => r.id === reserva.id);
      if (index !== -1) {
        this.reservas[index] = reserva;
      }
    }
    return reserva;
  }

  async create(reserva) {
    return this.save(reserva);
  }
}