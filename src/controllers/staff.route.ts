import express from "express";
import z, { codec } from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const staffSchema = z.object({
	name: z.string(),
	jobFunction: z.string(),
});

interface Staff extends RowDataPacket, z.infer<typeof staffSchema> {}

router.post("/", async (req, res) => {
	const { jobFunction, name } = staffSchema.parse(req.body);

	try {
		const conn = await getConnection();

		await conn.query("INSERT INTO staff(name, job_function) VALUES (?, ?)", [
			name,
			jobFunction,
		]);

		res.status(201).json({ message: "Staff created with success" });
	} catch (error) {
		throw error;
	}
});

router.get("/", async (_, res) => {
	try {
		const conn = await getConnection();

		const [staffs] = await conn.query<Staff[]>(
			"SELECT name, job_function, code FROM staff;",
		);

		return res.status(200).json({ staffs });
	} catch (error) {
		throw error;
	}
});

router.patch("/:code", async (req, res) => {
	const { jobFunction, name } = staffSchema.parse(req.body);
	try {
		const conn = await getConnection();

		const [foundStaff] = await conn.query<Staff[]>(
			"SELECT code, name, job_function FROM staff WHERE code = ?",
			[req.params.code],
		);

		if (foundStaff.length !== 1) {
			return res
				.status(500)
				.json({ message: "Duplicated KEYS found in DATABASE" });
		}

		await conn.query(
			"UPDATE staff SET name = ?, job_function = ? WHERE code = ?",
			[name, jobFunction, req.params.code],
		);
	} catch (error) {
		throw error;
	}
});
export { router };
