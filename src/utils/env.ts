import z from "zod/v4";

const envSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string().nonempty()
})

export const env = envSchema.parse(process.env)