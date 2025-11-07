import express from "express";
import { router as AppointmentsRouter } from "./controllers/appointments.route";
import { router as MedicRouter } from "./controllers/medic.route";
import { router as EspecialityRoutes } from "./controllers/medic-specialty.route";

import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use("/appointments", AppointmentsRouter);
app.use("/doctors", MedicRouter);
app.use("/specialties", EspecialityRoutes);

export { app };
