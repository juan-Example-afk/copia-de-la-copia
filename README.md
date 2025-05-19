# Birbnb

> Trabajo Práctico Integrador - 1C 2025
> Desarrollo de Software (K3011)
> Grupo 1

Este proyecto tiene como objetivo el desarrollo de Birbnb, una plataforma web para gestionar reservas de alojamientos temporales.

- [Ver consigna del trabajo](https://docs.google.com/document/d/1K0WJdOpcng4Jy-1PgIMz7CTtACT4HPSiiFB3IuM3l3o/edit?tab=t.0#heading=h.zho8hjgki4ue)

### Integrantes del equipo

| Nombre  | Legajo     |
|---------|------------|
|Brian Taylor|1631550 |
|Santiago Malirat|2138578|
|Nicolás Romero|2088162|
|         |            |
|         |            |

---

## Instalación del proyecto

1. Descargar [Node.js](https://nodejs.org/es)
2. Instalar proyecto
    ```bash
    git clone https://github.com/ddso-utn/tp-cuatrimestral-jueves-manana-ju-ma-grupo-01.git
    cd tp-cuatrimestral-jueves-manana-ju-ma-grupo-01
    npm install
    ```
3. Ejecutar proyecto
    ``` bash
    npm start
    ```

---

## Git Flow

Para garantizar una integración ordenada del código, el equipo acordó el siguiente flujo de trabajo:

1. **`main`**: Contiene el código de producción.
2. **`develop`**: Rama de integración de funcionalidades.
3. **`feature/*`**: Cada funcionalidad nueva se desarrolla en una rama propia partiendo de `develop`.
4. Pull requests obligatorios antes de fusionar a `develop`.
5. Deploys en `main` sólo al completar una entrega.



![Gitflow](https://github.com/user-attachments/assets/7193eebe-d56e-4afd-b6dd-d47328ae5afe)


## Entregas

### Entrega 1
- Implementación del modelo de objetos provisto.
- Endpoint de Health Check (`/health`).
- Definición de Git Flow del equipo.
