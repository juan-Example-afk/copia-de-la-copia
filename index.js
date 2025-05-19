import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { Server } from "./airbinb/server/server.js";

// Importar Controllers, Services y Repositories
import { AlojamientoRepository } from "./airbinb/models/repositories/alojamientoRepository.js";
import { AlojamientoService } from "./airbinb/services/alojamientoService.js";
import { AlojamientoController } from "./airbinb/controllers/alojamientoController.js";

import { ReservaRepository } from "./airbinb/models/repositories/reservaRepository.js";
import { ReservaService } from "./airbinb/services/reservaService.js";
import { ReservaController } from "./airbinb/controllers/reservaController.js";

import { UsuarioRepository } from "./airbinb/models/repositories/usuarioRepository.js";
import { UsuarioService } from "./airbinb/services/usuarioService.js";
import { UsuarioController } from "./airbinb/controllers/usuarioController.js";

import { NotificacionRepository } from "./airbinb/models/repositories/notificacionRepository.js";
import { NotificacionService } from "./airbinb/services/notificacionService.js";
import { NotificacionController } from "./airbinb/controllers/notificacionController.js";

import { CambioEstadoReservaRepository } from "./airbinb/models/repositories/cambioEstadoReservaRepository.js";
import { CambioEstadoReservaService } from "./airbinb/services/cambioEstadoReservaService.js";
import { CambioEstadoReservaController } from "./airbinb/controllers/cambioEstadoReservaController.js";

// Crear aplicación y servidor
console.log('NODE_ENV:', process.env.NODE_ENV);
const app = express();
const port = process.env.SERVER_PORT || 3000;
const server = new Server(app, port);

// Crear dependencias
const alojamientoRepo = new AlojamientoRepository();
const reservaRepo = new ReservaRepository();
const usuarioRepo = new UsuarioRepository();
const notificacionRepo = new NotificacionRepository();
const cambioEstadoRepo = new CambioEstadoReservaRepository();

const alojamientoService = new AlojamientoService(alojamientoRepo);
const reservaService = new ReservaService(reservaRepo,alojamientoRepo,usuarioRepo);
const usuarioService = new UsuarioService(usuarioRepo);
const notificacionService = new NotificacionService(notificacionRepo);
const cambioEstadoService = new CambioEstadoReservaService(cambioEstadoRepo);

const alojamientoController = new AlojamientoController(alojamientoService);
const reservaController = new ReservaController(reservaService);
const usuarioController = new UsuarioController(usuarioService);
const notificacionController = new NotificacionController(notificacionService);
const cambioEstadoController = new CambioEstadoReservaController(cambioEstadoService);

// Registrar controllers en el servidor
server.setController(AlojamientoController, alojamientoController);
server.setController(ReservaController, reservaController);
server.setController(UsuarioController, usuarioController);
server.setController(NotificacionController, notificacionController);
server.setController(CambioEstadoReservaController, cambioEstadoController);

// Configurar rutas y lanzar servidor
server.configureRoutes();
server.launch();
