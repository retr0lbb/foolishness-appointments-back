import express from "express";
import z4 from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const createAppointmentSchema = z4.object({
	medicId: z4.string(),
	patientCpf: z4.string(),
	staffCode: z4.number().positive().int(),
	dateTime: z4.coerce.date(),
});

interface Appointment
	extends RowDataPacket,
		z4.infer<typeof createAppointmentSchema> {
	id: number;
}

router.post("/", async (req, res) => {
	const { dateTime, medicId, patientCpf, staffCode } =
		createAppointmentSchema.parse(req.body);
	const connection = await getConnection();
	try {
		await connection.query(
			"INSERT INTO appointments(patient_cpf, doctor_id, staff_code, date) VALUES (?, UUID_TO_BIN(?), ?, ?);",
			[patientCpf, medicId, staffCode, dateTime],
		);

		return res
			.status(201)
			.json({ message: "Appointment Created with success" });
	} catch (error) {
		console.error(error);
		throw error;
	}
});

router.get("/", async (_, res) => {
	try {
		const conn = await getConnection();
		const [appointments] = await conn.query<Appointment[]>(
			"SELECT id, patient_cpf, BIN_TO_UUID(doctor_id) as doctor_id, staff_code, date FROM appointments",
		);

		return res.status(200).json({ appointments });
	} catch (error) {
		throw error;
	}
});

export { router };
