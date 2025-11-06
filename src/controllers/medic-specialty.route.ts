import express from "express";
import z from "zod/v4";
import { getConnection } from "../db/client";

const router = express.Router();

const medicSpecialtySchema = z.object({
	RQE: z.string().nonempty(),
	medic_id: z.string(),
});

router.post("/", async (req, res) => {
	try {
		const { RQE, medic_id } = medicSpecialtySchema.parse(req.body);
		const conn = await getConnection();

		await conn.query(
			"INSERT INTO doctor_specialization(doctor_id, RQE) VALUES (?, ?);",
			[medic_id, RQE],
		);

		return res.status(201).json({ message: "specialty created with success" });
	} catch (error) {
		console.error(error);
		throw error;
	}
});
