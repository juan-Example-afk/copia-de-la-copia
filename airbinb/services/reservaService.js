import { NotFoundError, ValidationError } from '../errors/appError.js';

export class ReservaService {
  constructor(reservaRepository, alojamientoRepository, usuarioRepository) {
    this.reservaRepository = reservaRepository;
    this.alojamientoRepository = alojamientoRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async findAll() {
    return await this.reservaRepository.findAll();
  }

  async findByUsuario(usuarioId) {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return await this.reservaRepository.findByUsuarioId(usuario.id);
  }

  async findById(id) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }
    return reserva;
  }

  async create(data) {
    const { huespedReservador, cantHuespedes, fechaInicio, fechaFin, idAlojamiento } = data;

    const alojamiento = await this.alojamientoRepository.findById(idAlojamiento);
    if (!alojamiento) {
      throw new NotFoundError('Alojamiento no encontrado');
    }

    const disponible = await this.reservaRepository.estaDisponible(idAlojamiento, fechaInicio, fechaFin);
    if (!disponible) {
      throw new ValidationError('El alojamiento no está disponible en esas fechas');
    }

    const huesped = await this.usuarioRepository.findById(huespedReservador);
    if (!huesped) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const reserva = await this.reservaRepository.create({
      huespedReservador,
      cantHuespedes,
      fechaInicio,
      fechaFin,
      idAlojamiento
    });

    return this.toDTO(reserva);
  }

  async actualizarEstado(id, nuevoEstado, motivo, usuarioId) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }

    if (nuevoEstado === 'cancelada' && new Date(reserva.fechaInicio) <= new Date()) {
      throw new ValidationError('No se puede cancelar una reserva ya iniciada o pasada');
    }

    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado para registrar el cambio de estado');
    }

    const actualizada = await this.reservaRepository.actualizarEstado(id, nuevoEstado, motivo, usuario);
    return this.toDTO(actualizada);
  }

  async modificarReserva(id, cambios) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }

    // Verificar disponibilidad si cambian las fechas
    const nuevaFechaInicio = cambios.fechaInicio || reserva.fechaInicio;
    const nuevaFechaFin = cambios.fechaFin || reserva.fechaFin;

    if (cambios.fechaInicio || cambios.fechaFin) {
      const disponible = await this.reservaRepository.estaDisponible(
        reserva.idAlojamiento,
        nuevaFechaInicio,
        nuevaFechaFin,
        id // excluir la reserva actual
      );

      if (!disponible) {
        throw new ValidationError('El alojamiento no está disponible en las nuevas fechas');
      }
    }

    const modificada = await this.reservaRepository.modificarReserva(id, cambios);
    return this.toDTO(modificada);
  }

  async cancelarReserva(id) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }

    if (new Date(reserva.fechaInicio) <= new Date()) {
      throw new ValidationError('No se puede cancelar una reserva ya iniciada o pasada');
    }

    const cancelada = await this.reservaRepository.actualizarEstado(id, 'cancelada', 'Cancelación solicitada', null);
    return this.toDTO(cancelada);
  }

  toDTO(reserva) {
    return {
      id: reserva.id,
      huesped: reserva.huespedReservador?.nombre ?? reserva.huespedReservador,
      alojamientoId: reserva.idAlojamiento,
      fechas: reserva.rangoFechas?.toString?.() ?? `${reserva.fechaInicio} - ${reserva.fechaFin}`,
      estado: reserva.estado,
    };
  }
}
