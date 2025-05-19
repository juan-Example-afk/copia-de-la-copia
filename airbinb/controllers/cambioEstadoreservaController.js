import { NotFoundError } from "../errors/appError.js"; // asumido que usás errores similares

export class CambioEstadoReservaController {
  constructor(cambioEstadoService) {
    this.cambioEstadoService = cambioEstadoService;
  }

  async findAll(req, res, next) {
    try {
      const cambios = await this.cambioEstadoService.findAll();
      res.json(cambios);
    } catch (error) {
      next(error);
    }
  }

  async findByReserva(req, res, next) {
    try {
      const idReserva = Number(req.params.id);
      if (isNaN(idReserva)) {
        throw new ValidationError("ID de reserva inválido");
      }

      const cambios = await this.cambioEstadoService.findByReserva(idReserva);
      if (!cambios || cambios.length === 0) {
        throw new NotFoundError(`No se encontraron cambios para la reserva ID ${idReserva}`);
      }

      res.json(cambios);
    } catch (error) {
      next(error);
    }
  }
}
