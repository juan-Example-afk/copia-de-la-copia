import { CambioEstadoReserva } from "./CambioEstadoReserva.js";
import { EstadoReserva } from "./EstadoReserva.js";

export class Reserva {
  constructor(
    huespedReservador,
    cantHuespedes,
    rangoFechas,
    idAlojamiento,
  ) {
    this.id = null; // Se asignará al persistir
    this.huespedReservador = huespedReservador;
    this.fechaAlta = new Date();
    this.cantHuespedes = cantHuespedes;
    this.idAlojamiento = idAlojamiento;
    this.rangoFechas = rangoFechas;
    this.estado = EstadoReserva.PENDIENTE;
    this.motivoCancelacion = null;
    this.canceladaPor = null;
    this.cambiosEstado = [];
  }

  actualizarEstado(nuevoEstado, motivo, usuario) {
    if (!Object.values(EstadoReserva).includes(nuevoEstado)) {
      throw new Error('Estado de reserva inválido');
    }
    
    const cambio = new CambioEstadoReserva(nuevoEstado, this, motivo, usuario);
    this.estado = nuevoEstado;
    this.cambiosEstado.push(cambio);
    
    if (nuevoEstado === EstadoReserva.CANCELADA) {
      this.motivoCancelacion = motivo;
      this.canceladaPor = usuario;
    }
    
    return this;
  }

  estaVigente() {
    return this.estado === EstadoReserva.CONFIRMADA && 
           new Date() <= this.rangoFechas.fechaFin;
  }
}