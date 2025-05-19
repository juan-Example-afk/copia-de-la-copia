import { EstadoReserva } from "./EstadoReserva.js";
import { FactoryNotificacion } from "./FactoryNotificacion.js";

export class Alojamiento {
  constructor(
    idAlojamiento, // para evitar la referencia circular Alojamiento -> Reserva -> Alojamiento
    nombre,
    descripcion,
    precioPorNoche,
    moneda,
    horarioCheckIn,
    horarioCheckOut,
    direccion,
    cantHuespedesMax,
    anfitrion,
    caracteristicas,
    fotos
  ) {
    this.idAlojamiento = idAlojamiento; // para evitar la referencia circular Alojamiento -> Reserva -> Alojamiento
    this.anfitrion = anfitrion;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioPorNoche = precioPorNoche;
    this.moneda = moneda;
    this.horarioCheckIn = horarioCheckIn;
    this.horarioCheckOut = horarioCheckOut;
    this.direccion = direccion;
    this.cantHuespedesMax = cantHuespedesMax;
    this.caracteristicas = caracteristicas;
    this.reservas = [];
    this.fotos = fotos;
  }

  tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
    return (
      this.precioPorNoche >= valorMinimo && this.precioPorNoche <= valorMaximo
    );
  }

  tenesCaracteristica(caracteristica) {
    return this.caracteristicas.includes(caracteristica);
  }

  puedenAlojarse(cantHuespedes) {
    return cantHuespedes <= this.cantHuespedesMax;
  }

  estasDisponibleEn(rangoFechas) {
    let diasAConsultar = rangoFechas.listaDeDias();
    let diasReservados = this.reservas.flatMap((reserva) =>
      reserva.rangoFechas.listaDeDias()
    );

    //por como maneja javascript las Date() es necesario convertirlas a string para poder compararlas
    diasAConsultar = diasAConsultar.map((d) => d.toDateString());
    diasReservados = diasReservados.map((d) => d.toDateString());

    return !diasAConsultar.some(dia => diasReservados.includes(dia));
  }

  aceptarReserva(reserva) {
    if (!this.estasDisponibleEn(reserva.rangoFechas)) {
      //throw new Error("El alojamiento no está disponible en esas fechas.");
      console.error("El alojamiento no está disponible en esas fechas.");
    }

    reserva.actualizarEstado(EstadoReserva.CONFIRMADA);
    this.reservas.push(reserva);

    //creo que esto debería ir por fuera del método en el index.js después de aceptar la reserva
    //porque no es como tal parte de aceptar una reserva sino algo extra (?) igual el funcionamiento es idéntico
    const notificacion = FactoryNotificacion.crearSegunReserva(
      reserva,
      this.nombre + " aceptó su reserva"
    );
  }

  rechazarReserva(reserva, motivo = null) {
    if (!this.reservas.includes(reserva)) {
      //throw new Error("La reserva no pertenece a este alojamiento.");
      console.error("La reserva no pertenece a este alojamiento.");
    }

    reserva.actualizarEstado(EstadoReserva.CANCELADA);

    const notificacion = FactoryNotificacion.crearSegunReserva(
      reserva,
      this.nombre + " rechazó su reserva"
    );
  }
}
