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
      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const nueva = await this.reservaService.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
  }

  async actualizarEstado(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { nuevoEstado, motivo, usuario } = req.body;
      const actualizada = await this.reservaService.actualizarEstado(id, nuevoEstado, motivo, usuario);
      res.json(actualizada);
    } catch (error) {
      next(error);
    }
  }
}