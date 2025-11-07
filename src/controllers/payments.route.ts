import express from "express";
import z from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const paymentSchema = z.object({
	value: z.string(),
	payment_method: z.literal("card").or(z.literal("cash")),
	appointment_id: z.string(),
});

interface Payment extends RowDataPacket, z.infer<typeof paymentSchema> {}

router.post("/", async (req, res) => {
	const { appointment_id, payment_method, value } = paymentSchema.parse(
		req.body,
	);

	try {
		const conn = await getConnection();

		await conn.query(
			"INSERT INTO payments(value, payment_method, appointment_id) VALUES (?, ?, ?)",
			[value, payment_method, appointment_id],
		);
	} catch (error) {
		throw error;
	}
});
export { router };
