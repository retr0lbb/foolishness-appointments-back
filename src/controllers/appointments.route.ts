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

router.get("/", async (req, res) => {
	try {
		const conn = await getConnection();
		const { cpf } = req.query;

		let sql = `
			SELECT 
				a.id, 
				a.patient_cpf, 
				BIN_TO_UUID(a.doctor_id) as doctor_id,
				d.name as doctor_name,
				d.crm as doctor_crm,
				a.staff_code, 
				a.date 
			FROM appointments a
			LEFT JOIN doctors d ON a.doctor_id = d.id
		`;
		const params: any[] = [];

		if (cpf) {
			sql += " WHERE a.patient_cpf = ?";
			params.push(cpf);
		}

		sql += " ORDER BY a.date DESC";

		const [appointments] = await conn.query<Appointment[]>(sql, params);

		return res.status(200).json({ appointments });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to fetch appointments" });
	}
});

export { router };
