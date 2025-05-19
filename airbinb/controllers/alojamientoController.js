export class AlojamientoController {
    constructor(alojamientoService) {
      this.alojamientoService = alojamientoService;
    }

    async findAll(req, res, next) {
      try {
        const alojamientos = await this.alojamientoService.findAll();
        res.json(alojamientos);
      } catch (error) {
        next(error);
      }
    }

    async findById(req, res, next) {
      try {
      const id = Number(req.params.id);
      const alojamiento = await this.alojamientoService.findById(id);
      if (!alojamiento) {
        throw new NotFoundError('No se encontraron reservas para este usuario');
      }
      res.json(alojamiento);
    } catch (error) {
      next(error);
    };
   }

   async create(req, res, next) {
    try {
      const nueva = await this.alojamientoService.create(req.body);
      if (!nueva) throw new ValidationError('Error al crear la reserva');
      res.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
   }


    async delete(req, res, next) {
        try {
          const id = Number(req.params.id);
          const eliminado =  await this.alojamientoService.delete(id);
          if (!eliminado) {
            return res.status(404).json({ error: "Alojamiento no encontrado" });
          }
          res.status(204).send();
        } catch (error) {
          next(error);
        }
      }

  }

