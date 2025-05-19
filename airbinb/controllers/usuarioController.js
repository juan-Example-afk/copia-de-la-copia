import { ValidationError } from '../errors/appError.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async findAll(req, res, next) {
    try {
      const usuarios = await this.usuarioService.findAll();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const email = req.params.id;
      const usuario = await this.usuarioService.findById(email);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const nuevo = await this.usuarioService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const email = req.params.id;
      const actualizado = await this.usuarioService.update(email, req.body);
      res.json(actualizado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const email = req.params.id;
      await this.usuarioService.delete(email);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}