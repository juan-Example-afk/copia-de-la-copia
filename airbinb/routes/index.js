import { registerAlojamientoRoutes } from './alojamientoRoutes.js';
import { registerCambioEstadoReservaRoutes } from './cambioEstadoReservaRoutes.js';
import {registerNotificacionRoutes  } from './notificacionRoutes.js';
import { registerReservaRoutes } from './reservaRoutes.js';
import { registerUsuarioRoutes } from './usuarioRoutes.js';

export function configureRoutes(app, getController) {
    registerAlojamientoRoutes(app, getController);
    registerCambioEstadoReservaRoutes(app, getController);
    registerNotificacionRoutes(app, getController);
    registerReservaRoutes(app, getController);
    registerUsuarioRoutes(app, getController);
}