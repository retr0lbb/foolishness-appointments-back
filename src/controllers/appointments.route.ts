import express from "express"
import z4 from "zod/v4"
import {getConnection} from "../db/client"

const router = express.Router()


const createAppointmentSchema = z4.object({
    medicCrm: z4.string(),
    patientCpf: z4.string(),
    staffCode: z4.string(),
    dateTime: z4.coerce.date(),
})

router.post("/", async(req, res) => {
    const { dateTime, medicCrm, patientCpf, staffCode } = createAppointmentSchema.parse(req.body)
    const connection = await getConnection()
    try {
        await connection.query("INSERT INTO appointments VALUES (?, ?, ?, ?);", 
        [patientCpf, medicCrm, staffCode, dateTime])

        return res.status(201).json({message: "Sent"})
    
    } catch (error) {
        console.error(error)    
    }
    
})



export { router }