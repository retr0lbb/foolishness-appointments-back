import express from "express";
import z from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const medicSpecialtySchema = z.object({
	RQE: z.string().nonempty(),
	medic_id: z.string(),
	specialization: z.string(),
});

interface MedicSpecialty
	extends RowDataPacket,
		z.infer<typeof medicSpecialtySchema> {}

router.post("/", async (req, res) => {
	try {
		const { RQE, medic_id, specialization } = medicSpecialtySchema.parse(
			req.body,
		);
		const conn = await getConnection();

		await conn.query(
			`
      INSERT INTO doctor_specialization (doctor_id, RQE, specialization)
      VALUES (UUID_TO_BIN(?), ?, ?);
      `,
			[medic_id, RQE, specialization],
		);

		return res.status(201).json({
			message: "Specialty created with success",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error });
	}
});

router.get("/", async (_, res) => {
	try {
		const conn = await getConnection();

		const [specialties, _] = await conn.query<MedicSpecialty[]>(
			"SELECT id, BIN_TO_UUID(doctor_id) as doctor_id, specialization, RQE FROM doctor_specialization",
		);

		return res.status(200).json({ specialties });
	} catch (error) {
		throw error;
	}
});

export { router };
