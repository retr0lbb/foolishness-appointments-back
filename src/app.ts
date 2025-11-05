import express from "express"
import {router as AppointmentsRouter} from "./controllers/appointments.route"
import {router as MedicRouter} from "./controllers/medic.route"

import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.json())


app.use("/appointments",AppointmentsRouter)
app.use("/doctors", MedicRouter)


export { app }