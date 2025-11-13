import express from "express";
import z from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const paymentSchema = z.object({
	value: z.string(),
	payment_method: z
		.literal("card")
		.or(z.literal("cash"))
		.or(z.literal("insurance")),
	appointment_id: z.number(),
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

		return res.send(201).send("Payment Method created");
	} catch (error) {
		throw error;
	}
});

router.get("/", async (req, res) => {
	try {
		const conn = await getConnection();

		const [payments] = await conn.query<Payment[]>(
			"SELECT BIN_TO_UUID(id) as id, value, payment_method, appointment_id from payments;",
		);

		res.status(200).json({ payments });
	} catch (error) {
		throw error;
	}
});
export { router };
