import { Notificacion } from "./Notificacion.js";

export class FactoryNotificacion {
  //es un factory
  static crearSegunReserva(reserva, mensaje) {
    const usuario = reserva.huespedReservador;
    const fechaAlta = reserva.fechaAlta;

    return new Notificacion(mensaje, usuario, fechaAlta);
  }
}
