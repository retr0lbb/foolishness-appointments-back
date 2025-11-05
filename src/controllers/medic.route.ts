import express from "express"
import z from "zod/v4"
import {getConnection} from "../db/client"

const router = express.Router()

const medicSchema = z.object({
    crm: z.string(),
    phone: z.string(),
    name: z.string()
})

router.post("/", async(req, res) => {
    const {crm, name, phone} = medicSchema.parse(req.body);
    const conn = await getConnection()

    try {
        await conn.query("INSERT INTO doctors values (?, ?, ?);" , [crm, name, phone])

        return res.status(201).json({message: "medic Created"})
    } catch (error) {
        console.log(error)
    }
})

router.get("/", async(req, res) => {
    const conn = await getConnection();

    try {
        const [result, _] = await conn.query("SELECT crm, name, phone FROM doctors")

        return res.status(200).json({doctors: result})

    } catch (error) {
        console.log(error)
    }
})

router.get("/:crm", async (req, res) => {
    const conn = await getConnection()

    try {
        const [medic, _] = await conn.query("SELECT crm, name, phone FROM doctors WHERE crm = ?", [req.params.crm])

        console.log(medic);

        res.status(200).send("noob")
    } catch (error) {
        console.log(error)
    }
})


export {router}