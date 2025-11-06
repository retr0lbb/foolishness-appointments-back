import express from "express"
import z from "zod/v4"
import {getConnection} from "../db/client"
import type { RowDataPacket } from "mysql2"

const router = express.Router()

const medicSchema = z.object({
    crm: z.string(),
    phone: z.string(),
    name: z.string()
})

interface Doctor extends RowDataPacket, z.infer<typeof medicSchema> {

}

router.post("/", async(req, res) => {
    const {crm, name, phone} = medicSchema.parse(req.body);
    const conn = await getConnection()

    try {
        await conn.query("INSERT INTO doctors(name, phone, crm) values (?, ?, ?);" , [name, phone, crm])

        return res.status(201).json({message: "medic Created"})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
})


const searchParamsSchema = z.object({
    crm: z.string().nullable().optional(),
    state: z.string().nullable().optional()
})

router.get("/", async (req, res) => {
  const conn = await getConnection();

  const { crm, state } = searchParamsSchema.parse(req.query);

  try {
    let sql = `
      SELECT BIN_TO_UUID(id) AS id, crm, name, phone
      FROM doctors
    `;

    // biome-ignore lint/suspicious/noExplicitAny: no need
    const params: any[] = [];

    if (crm && state) {
      sql += " WHERE crm = ?";
      params.push(`${crm}/${state}`);
    }

    const [rows] = await conn.query<Doctor[]>(sql, params);

    console.log("SQL Executada:", sql, params);

    return res.status(200).json({ doctors: rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});


router.get("/:id", async (req, res) => {
    const conn = await getConnection()

    try {
        const [medic, _] = await conn.query<Doctor[]>("SELECT crm, name, phone FROM doctors WHERE BIN_TO_UUID(id) = ?", [req.params.id])

        if (medic.length === 0) {
            return res.status(404).json({ message: "Medic Not found" });
        }

        if(medic.length >= 1){
            return res.status(500).send("Duplicated Keys Found in db, please warn db manager")
        }

        res.status(200).json({medic})
    } catch (error) {
        console.log(error)
        throw error
    }
})

router.delete("/:id", async (req, res) => {
    const conn = await getConnection()

    try {
        const [medic, _] = await conn.query<Doctor[]>("SELECT crm, name, phone FROM doctors WHERE BIN_TO_UUID(id) = ?", [req.params.id])

        if (medic.length === 0) {
            return res.status(200).json({ message: "Medic doesnt exists anymore" });
        }

        if(medic.length > 1){
            console.log(medic)
            return res.status(500).send("Duplicated Keys Found in db, please warn db manager")
        }

        await conn.query("DELETE from doctors WHERE BIN_TO_UUID(id) = ?", [req.params.id])

        res.status(200).json({message: "medic Deleted"})
    } catch (error) {
        console.log(error)
        throw error
    }
})



router.put("/:id", async (req, res) => {
    const conn = await getConnection();

    const { crm, name, phone } = medicSchema.parse(req.body);

    try {
        const [medic] = await conn.query<Doctor[]>(
            "SELECT crm, name, phone FROM doctors WHERE BIN_TO_UUID(id) = ?",
            [req.params.id]
        );

        if (medic.length === 0) {
            return res.status(404).json({ message: "Medic does not exist" });
        }

        if (medic.length > 1) {
            console.log(medic);
            return res.status(500).send("Duplicated Keys found, contact database admin");
        }

        await conn.query(
            `
            UPDATE doctors
            SET crm = ?, name = ?, phone = ?
            WHERE BIN_TO_UUID(id) = ?
            `,
            [crm, name, phone, req.params.id]
        );

        res.status(200).json({
            message: "Medic updated successfully",
            medic: {
                id: req.params.id,
                crm,
                name,
                phone,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});


export {router}