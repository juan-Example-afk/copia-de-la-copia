import {Server} from '../airbinb/server/server.js'
import express from 'express'

export function buildTestServer() {
    const server = new Server(
        express()
    )
    server.configureRoutes()
    return server
}