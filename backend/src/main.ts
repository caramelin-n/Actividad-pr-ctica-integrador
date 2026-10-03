import { app } from "./app.js"
import { DBConnection } from "./database/DatabaseConnection.js"
import "./models/Relations.js"
import { API_PORT } from "./config/env.js"

async function main() {
    await DBConnection.connect()
    await DBConnection.getInstance().sync()
    app.listen(API_PORT, () => console.log(`Servidor encendido y escuchando en localhost:${API_PORT}`))
}

main().catch((err) => {
    console.error("Error al iniciar el servidor", err)
    process.exit(1)
})