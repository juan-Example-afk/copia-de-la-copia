import { TipoUsuario } from "./TipoUsuario.js";
import { Reserva } from "./Reserva.js";
import { FactoryNotificacion } from "./FactoryNotificacion.js";

export class Usuario {
  constructor(nombre, email, tipo) {
    if (!nombre || !email || !tipo) {
      throw new Error("Nombre, email y tipo son campos requeridos");
    }
    if (!Object.values(TipoUsuario).includes(tipo)) {
      throw new Error("Tipo de usuario inválido");
    }
    
    this.nombre = nombre;
    this.email = email;
    this.tipo = tipo;
    this.notificaciones = [];
  }

  realizarReserva(alojamiento, cantHuespedes, rangoFechas) {
    if (this.tipo !== TipoUsuario.HUESPED) {
      throw new Error("Solo los huéspedes pueden realizar reservas.");
    }

    if (!alojamiento.puedenAlojarse(cantHuespedes)) {
      throw new Error("La cantidad de huéspedes excede el máximo permitido.");
    }

    const nuevaReserva = new Reserva(
      this,
      cantHuespedes,
      rangoFechas,
      alojamiento.idAlojamiento
    );

    const notificacion = FactoryNotificacion.crearSegunReserva(
      nuevaReserva, 
      `${this.nombre} solicitó una reserva en ${alojamiento.nombre}`
    );
    
    return nuevaReserva;
  }

  recibirNotificacion(notificacion) {
    this.notificaciones.push(notificacion);
  }
}