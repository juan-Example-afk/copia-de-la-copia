import { NotFoundError, ValidationError } from '../errors/appError.js';
import { Reserva } from '../models/entities/Reserva.js';
import { RangoDeFechas } from '../models/entities/RangoDeFechas.js';

export class ReservaService {
  constructor(reservaRepository, alojamientoRepository, usuarioRepository, notificacionRepository) {
    this.reservaRepository = reservaRepository;
    this.alojamientoRepository = alojamientoRepository;
    this.usuarioRepository = usuarioRepository;
    this.notificacionRepository = notificacionRepository;
  }

  async findAll() {
    const reservas = await this.reservaRepository.findAll();
    return reservas.map(this.toDTO);
  }

  async findByUsuario(usuarioId) {
    const usuario = await this.usuarioRepository.findByEmail(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }
    const reservas = await this.reservaRepository.findByUsuarioId(usuarioId);
    return reservas.map(this.toDTO);
  }

  async findById(id) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }
    return this.toDTO(reserva);
  }

  async create(data) {
    const { huespedReservador, cantHuespedes, fechaInicio, fechaFin, idAlojamiento } = data;

    const alojamiento = await this.alojamientoRepository.findById(idAlojamiento);
    if (!alojamiento) {
      throw new NotFoundError('Alojamiento no encontrado');
    }

    const huesped = await this.usuarioRepository.findByEmail(huespedReservador);
    if (!huesped) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const rangoFechas = new RangoDeFechas(new Date(fechaInicio), new Date(fechaFin));
    
    if (!alojamiento.estasDisponibleEn(rangoFechas)) {
      throw new ValidationError('El alojamiento no está disponible en esas fechas');
    }

    const reserva = new Reserva(
      huesped,
      cantHuespedes,
      rangoFechas,
      idAlojamiento
    );

    const reservaGuardada = await this.reservaRepository.create(reserva);
    
    // Notificar al anfitrión
    const notificacion = {
      mensaje: `Nueva reserva solicitada por ${huesped.nombre} para ${alojamiento.nombre}`,
      usuario: alojamiento.anfitrion,
      reserva: reservaGuardada
    };
    await this.notificacionRepository.save(notificacion);

    return this.toDTO(reservaGuardada);
  }

  async actualizarEstado(id, nuevoEstado, motivo, usuarioId) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundError('Reserva no encontrada');
    }

    const usuario = await this.usuarioRepository.findByEmail(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const actualizada = await reserva.actualizarEstado(nuevoEstado, motivo, usuario);
    await this.reservaRepository.save(reserva);

    // Notificar al huésped del cambio
    const notificacion = {
      mensaje: `Tu reserva ha cambiado a estado: ${nuevoEstado}${motivo ? ` - Motivo: ${motivo}` : ''}`,
      usuario: reserva.huespedReservador,
      reserva: reserva
    };
    await this.notificacionRepository.save(notificacion);

    return this.toDTO(actualizada);
  }

  toDTO(reserva) {
    return {
      id: reserva.id,
      huespedReservador: {
        email: reserva.huespedReservador.email,
        nombre: reserva.huespedReservador.nombre
      },
      alojamientoId: reserva.idAlojamiento,
      cantHuespedes: reserva.cantHuespedes,
      fechaInicio: reserva.rangoFechas.fechaInicio,
      fechaFin: reserva.rangoFechas.fechaFin,
      estado: reserva.estado,
      fechaAlta: reserva.fechaAlta,
      motivoCancelacion: reserva.motivoCancelacion,
      canceladaPor: reserva.canceladaPor ? {
        email: reserva.canceladaPor.email,
        nombre: reserva.canceladaPor.nombre
      } : null
    };
  }
}