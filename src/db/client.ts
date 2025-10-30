import msql from "mysql2"
import { env } from "../utils/env"

const connection = msql.createConnection({
    host: "localhost",
    user: "docker",
    database: "foolish",
    password: "docker"
})

export { connection }