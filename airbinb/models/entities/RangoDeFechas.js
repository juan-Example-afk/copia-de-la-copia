export class RangoDeFechas {
  constructor(fechaInicio, fechaFin) {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }

  //Esta lógica solo es válida si no puede haber mas de una reserva el mismo dia
  //(podría haber más de una reserva en el dia si alguien hace checkOut a mañana y otro checkIn a la tarde) pero no hagamos esojajaj
  listaDeDias() {
    const dias = [];
    let actual = new Date(this.fechaInicio);

    while (actual <= this.fechaFin) {
      dias.push(new Date(actual));
      actual.setDate(actual.getDate() + 1);
    }

    return dias;
  }
}
