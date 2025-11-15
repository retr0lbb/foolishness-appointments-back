import express from "express";
import z from "zod/v4";
import { getConnection } from "../db/client";
import type { RowDataPacket } from "mysql2";

const router = express.Router();

const patientSchema = z.object({
	cpf: z.string(),
	phone: z.string(),
	name: z.string(),
	address: z.string(),
});

interface Patient extends RowDataPacket, z.infer<typeof patientSchema> {}

router.post("/", async (req, res) => {
	const { address, cpf, name, phone } = patientSchema.parse(req.body);

	try {
		const conn = await getConnection();

		await conn.query(
			"INSERT INTO patients(cpf, phone, name, address) VALUES (?, ?, ?, ?)",
			[cpf, phone, name, address],
		);

		return res.status(201).json({ message: "Patient created with success" });
	} catch (error) {
		res.status(500).json({ message: "An unexpected Error occurred", error });
	}
});

router.get("/", async (_, res) => {
	try {
		const conn = await getConnection();

		const [patient, _] = await conn.query<Patient[]>(
			"SELECT BIN_TO_UUID(id) as id, cpf, name, address FROM patients",
		);

		return res.status(200).json({ patients: patient });
	} catch (error) {
		res.status(500).json({ message: "An unexpected Error occurred", error });
	}
});

router.get("/cpf", async (req, res) => {
	console.log("🔥 ROTA /cpf FOI CHAMADA!");
	try {
		const conn = await getConnection();

		const { cpf } = req.query;

		if (!cpf) {
			return res.status(400).json({ message: "CPF is required" });
		}

		const [patient, _] = await conn.query<Patient[]>(
			"SELECT BIN_TO_UUID(id) as id, cpf, name, address FROM patients WHERE cpf = ?",
			[cpf],
		);

		console.log("Buscando CPF:", cpf); // Debug
		console.log("Resultado:", patient); // Debug

		if (patient.length <= 0) {
			return res.status(404).json({ message: "User not found asdadas" });
		}

		if (patient.length > 1) {
			return res.status(500).json({
				message: "Error duplicated keys found, please contact your db manager",
			});
		}

		return res.status(200).json({ patient: patient[0] });
	} catch (error) {
		console.error("Erro na query:", error); // Debug melhor
		res.status(500).json({ message: "An unexpected Error occurred", error });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const conn = await getConnection();
		const id = req.params.id;

		const [patient, _] = await conn.query<Patient[]>(
			"SELECT BIN_TO_UUID(id) as id, cpf, name, address FROM patients WHERE BIN_TO_UUID(id) = ?",
			[id],
		);

		if (patient.length <= 0) {
			return res.status(404).send("User not found");
		}

		if (patient.length > 1) {
			return res
				.status(500)
				.send("Error duplicated keys found, please contact your db manager");
		}

		return res.status(200).json({ patient });
	} catch (error) {
		res.status(500).json({ message: "An unexpected Error occurred", error });
	}
});

export { router };
