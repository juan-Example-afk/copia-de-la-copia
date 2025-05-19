import { NotFoundError, ValidationError } from '../errors/appError.js';

export class ReservaController {
  constructor(reservaService) {
    this.reservaService = reservaService;
  }

  async findAll(req, res, next) {
    try {
      const reservas = await this.reservaService.findAll();
      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const reserva = await this.reservaService.findById(id);
      if (!reserva) throw new NotFoundError('Reserva no encontrada');
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async historialPorUsuario(req, res, next) {
    try {
      const usuarioId = String(req.params.id);
      const reservas = await this.reservaService.findByUsuario(usuarioId);
      // Return empty array if no reservations found instead of throwing error
      res.json(reservas || []);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const nueva = await this.reservaService.create(req.body);
      if (!nueva) throw new ValidationError('Error al crear la reserva');
      res.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
  }

  async modificar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const cambios = req.body;
      const modificada = await this.reservaService.modificarReserva(id, cambios);
      if (!modificada) throw new ValidationError('No se pudo modificar la reserva');
      res.json(modificada);
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const cancelada = await this.reservaService.cancelarReserva(id);
      if (!cancelada) throw new ValidationError('No se pudo cancelar la reserva');
      res.json(cancelada);
    } catch (error) {
      next(error);
    }
  }

  async actualizarEstado(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { nuevoEstado, motivo, usuario } = req.body;
      const actualizada = await this.reservaService.actualizarEstado(id, nuevoEstado, motivo, usuario);
      if (!actualizada) throw new ValidationError('No se pudo actualizar el estado');
      res.json(actualizada);
    } catch (error) {
      next(error);
    }
  }
}