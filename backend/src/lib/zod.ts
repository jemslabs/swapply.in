import {z} from 'zod'

export const authSchema = z.object({
    name: z.string().min(2, "Name too short").optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters")
})