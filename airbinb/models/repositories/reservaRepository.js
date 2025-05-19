export class ReservaRepository {
  constructor() {
    this.reservas = [];
    this.currentId = 1;
  }

  async findAll() {
    return this.reservas;
  }

  async findById(id) {
    return this.reservas.find(r => r.id === id);
  }

  async findByUsuarioId(usuarioId) {
    return this.reservas.filter(r => r.huespedReservador === usuarioId);
  }

  async estaDisponible(idAlojamiento, fechaInicio, fechaFin, excluirId = null) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    return !this.reservas.some(r => {
      if (excluirId && r.id === excluirId) return false;
      if (r.idAlojamiento !== idAlojamiento) return false;

      const rInicio = new Date(r.fechaInicio);
      const rFin = new Date(r.fechaFin);

      return (
        (inicio >= rInicio && inicio < rFin) ||
        (fin > rInicio && fin <= rFin) ||
        (inicio <= rInicio && fin >= rFin)
      );
    });
  }

  async create(data) {
    const nuevaReserva = {
      id: this.currentId++,
      ...data,
      estado: 'confirmada',
      fechaAlta: new Date()
    };
    this.reservas.push(nuevaReserva);
    return nuevaReserva;
  }

  async actualizarEstado(id, nuevoEstado, motivo, usuario) {
    const reserva = await this.findById(id);
    if (!reserva) return null;

    reserva.estado = nuevoEstado;

    // Setear fechaAlta si pasa a "confirmada" y aún no estaba
    if (nuevoEstado === 'confirmada' && !reserva.fechaAlta) {
      reserva.fechaAlta = new Date();
    }

    if (nuevoEstado === 'cancelada') {
      reserva.motivoCancelacion = motivo;
      reserva.canceladaPor = usuario?.id ?? usuario;
    }

    return reserva;
  }

  async modificarReserva(id, cambios) {
    const reserva = await this.findById(id);
    if (!reserva) return null;

    Object.assign(reserva, cambios);
    return reserva;
  }
}
