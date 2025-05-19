import { Alojamiento } from '../models/entities/Alojamiento.js';
import { ValidationError, ConflictError, NotFoundError } from "../errors/appError.js";

export class AlojamientoService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return await this.repository.findAll();
  }


  async listarAlojamientos(filtros = {}, pagina = 1, limite = 10) {
    let alojamientosFiltrados = await this.repository.findAll();

    if (!Array.isArray(alojamientosFiltrados)) {
      throw new Error("El repositorio no devolvió una lista de alojamientos");
    }

    if (filtros.ubicacion) {
      alojamientosFiltrados = this.filtrarPorUbicacionTexto(alojamientosFiltrados, filtros.ubicacion);
    } else if (filtros.ubicacionCoordenadas) {
      alojamientosFiltrados = this.filtrarPorUbicacionCoordenadas(
        alojamientosFiltrados,
        filtros.ubicacionCoordenadas,
        filtros.radioUbicacionKm
      );
    }

    if (filtros.precioMinimo !== undefined || filtros.precioMaximo !== undefined) {
      alojamientosFiltrados = this.filtrarPorPrecio(alojamientosFiltrados, filtros.precioMinimo, filtros.precioMaximo);
    }

    if (filtros.cantHuespedes !== undefined || (filtros.caracteristicas && filtros.caracteristicas.length > 0)) {
      alojamientosFiltrados = this.filtrarPorCaracteristicas(alojamientosFiltrados, filtros.cantHuespedes, filtros.caracteristicas);
    }

    const skip = (pagina - 1) * limite;
    const totalAlojamientos = alojamientosFiltrados.length;
    const alojamientosPaginados = alojamientosFiltrados.slice(skip, skip + limite);

    return {
      pagina,
      limite,
      total: totalAlojamientos,
      totalPaginas: Math.ceil(totalAlojamientos / limite),
      data: alojamientosPaginados.map(this.toDTO),
    };
  }

  filtrarPorUbicacionTexto(alojamientos, ubicacion) {
    return alojamientos.filter(alojamiento =>
      alojamiento.direccion?.ciudad?.toLowerCase().includes(ubicacion.toLowerCase()) ||
      alojamiento.direccion?.pais?.toLowerCase().includes(ubicacion.toLowerCase())
    );
  }

  filtrarPorUbicacionCoordenadas(alojamientos, coordenadas, radioKm = Infinity) {
    return alojamientos.filter(alojamiento =>
      this.calcularDistancia(alojamiento.direccion?.coordenadas, coordenadas) <= radioKm
    );
  }

  filtrarPorPrecio(alojamientos, precioMinimo, precioMaximo) {
    return alojamientos.filter(alojamiento =>
      alojamiento.tuPrecioEstaDentroDe(
        precioMinimo ?? 0,
        precioMaximo ?? Infinity
      )
    );
  }

  filtrarPorCaracteristicas(alojamientos, cantHuespedes, caracteristicas) {
    let filtrados = alojamientos;
    if (cantHuespedes !== undefined) {
      filtrados = filtrados.filter(a => a.puedenAlojarse(cantHuespedes));
    }
    if (caracteristicas?.length > 0) {
      filtrados = filtrados.filter(a =>
        caracteristicas.every(c => a.tenesCaracteristica(c))
      );
    }
    return filtrados;
  }

  async findById(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("El ID proporcionado no es válido");
    }

    const alojamiento = await this.repository.findById(id);
    if (!alojamiento) {
      throw new NotFoundError(`No se encontró un alojamiento con ID ${id}`);
    }

    return this.toDTO(alojamiento);
  }

  async create(data) {
    if (!data || !data.nombre || !data.descripcion || !data.precioPorNoche) {
      throw new ValidationError("Faltan campos requeridos: nombre, descripción o precioPorNoche");
    }

    const nuevo = new Alojamiento(
      null,
      data.nombre,
      data.descripcion,
      data.precioPorNoche,
      data.moneda,
      data.horarioCheckIn,
      data.horarioCheckOut,
      data.direccion,
      data.cantHuespedesMax,
      data.anfitrion,
      data.caracteristicas || [],
      data.fotos || []
    );

    const guardado = await this.repository.save(nuevo);
    return this.toDTO(guardado);
  }

  toDTO(a) {
    return {
      id: a.idAlojamiento,
      nombre: a.nombre,
      descripcion: a.descripcion,
      precioPorNoche: a.precioPorNoche,
      moneda: a.moneda,
      horarioCheckIn: a.horarioCheckIn,
      horarioCheckOut: a.horarioCheckOut,
      direccion: a.direccion,
      cantHuespedesMax: a.cantHuespedesMax,
      anfitrion: a.anfitrion,
      caracteristicas: a.caracteristicas,
      fotos: a.fotos,
    };
  }

  calcularDistancia(coord1, coord2) {
    if (!coord1 || !coord2 || coord1.latitud == null || coord1.longitud == null || coord2.latitud == null || coord2.longitud == null) {
      return Infinity;
    }

    const R = 6371;
    const dLat = this.toRadians(coord2.latitud - coord1.latitud);
    const dLon = this.toRadians(coord2.longitud - coord1.longitud);
    const lat1 = this.toRadians(coord1.latitud);
    const lat2 = this.toRadians(coord2.latitud);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(grados) {
    return grados * (Math.PI / 180);
  }
}
