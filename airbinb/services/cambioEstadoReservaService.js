import { CambioEstadoReserva } from '../models/entities/CambioEstadoReserva.js';
import { ValidationError, NotFoundError } from "../errors/appError.js";

export class CambioEstadoReservaService {
  constructor(cambioestadoReservaRepository) {
    this.cambioestadoReservaRepository = cambioestadoReservaRepository;
  }

  async findAll() {
    const cambios = await this.cambioestadoReservaRepository.findAll();
    if (!Array.isArray(cambios)) {
      throw new Error("El repositorio no devolvió una lista de cambios de estado");
    }
    return cambios.map(this.toDTO);
  }

  async findByReserva(idReserva) {
    if (!idReserva || isNaN(idReserva)) {
      throw new ValidationError("El ID de reserva proporcionado no es válido");
    }
    const cambios = await this.cambioestadoReservaRepository.findByReserva(idReserva);
    if (!cambios || cambios.length === 0) {
      throw new NotFoundError(`No se encontraron cambios de estado para la reserva con ID ${idReserva}`);
    }
    return cambios.map(this.toDTO);
  }

  toDTO(cambio) {
    return {
      fecha: cambio.fecha,
      estado: cambio.estadoReserva,
      motivo: cambio.motivo,
      usuario: cambio.usuario?.nombre || null,
    };
  }
}
