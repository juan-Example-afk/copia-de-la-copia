export class AlojamientoRepository {
    constructor() {
      this.alojamientos = [];
      this.nextId = 1;
    }

    async save(alojamiento) {
        alojamiento.idAlojamiento = this.nextId++;
        this.alojamientos.push(alojamiento);
        return alojamiento;
    }

    async findAll() {
      return this.alojamientos;
    }

    async findById(id) {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return this.alojamientos.find(a => a.idAlojamiento === numId);
    }

    async findByName(nombre) {
        return this.alojamientos.find(a => a.nombre === nombre);
    }

     async deleteById(id) {
        const index = this.alojamientos.findIndex(a => a.id === id);
        if (index === -1) return false;
        this.alojamientos.splice(index, 1);
        return true;
      }

    async findByNombreYAnfitrion(nombre, anfitrionEmail) {
      return this.alojamientos.find(
        (a) =>
          a.nombre === nombre &&
          a.anfitrion?.email === anfitrionEmail
      );
    }

    async findDisponibles(rangoFechas, cantHuespedes) {
      return this.alojamientos.filter(
        (a) =>
          a.estasDisponibleEn(rangoFechas) &&
          a.puedenAlojarse(cantHuespedes)
      );
    }

   async findByPrecioEntre(min, max) {
      return this.alojamientos.filter((a) =>
        a.tuPrecioEstaDentroDe(min, max)
      );
    }

   async findByCaracteristica(caracteristica) {
      return this.alojamientos.filter((a) =>
        a.tenesCaracteristica(caracteristica)
      );
    }
  }
