import express from "express";
import { router as AppointmentsRouter } from "./controllers/appointments.route";
import { router as MedicRouter } from "./controllers/medic.route";
import { router as EspecialityRouter } from "./controllers/medic-specialty.route";
import { router as PatientRouter } from "./controllers/patient.route";
import { router as PaymentRouter } from "./controllers/payments.route";
import { router as StaffRouter } from "./controllers/staff.route";

import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use("/appointments", AppointmentsRouter);
app.use("/doctors", MedicRouter);
app.use("/specialties", EspecialityRouter);
app.use("/patients", PatientRouter);
app.use("/payments", PaymentRouter);
app.use("/staff", StaffRouter);

export { app };
