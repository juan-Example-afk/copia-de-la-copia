import { Usuario } from '../models/entities/Usuario.js';
import { ValidationError, NotFoundError } from "../errors/appError.js";

export class UsuarioService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const usuarios = await this.repository.findAll();
    if (!Array.isArray(usuarios)) {
      throw new Error("El repositorio no devolvió una lista de usuarios");
    }
    return usuarios.map(this.toDTO);
  }

  async findById(email) {
    if (!email || typeof email !== 'string') {
      throw new ValidationError("El email proporcionado no es válido");
    }
    const usuario = await this.repository.findById(email);
    if (!usuario) {
      throw new NotFoundError(`No se encontró un usuario con email ${email}`);
    }
    return this.toDTO(usuario);
  }

  async create(usuarioData) {
    if (!usuarioData.email || !usuarioData.nombre) {
      throw new ValidationError("Faltan campos obligatorios: email o nombre");
    }

    // Validar si el email ya existe para evitar conflicto
    const existe = await this.repository.findById(usuarioData.email);
    if (existe) {
      throw new ValidationError("El email ya está registrado");
    }

    const usuarioGuardado = await this.repository.save(usuarioData);
    return this.toDTO(usuarioGuardado);
  }

  toDTO(usuario) {
    return {
      nombre: usuario.nombre,
      email: usuario.email,
      tipo: usuario.tipo
    };
  }
}
