import z from "zod";

export const signupInput = z.object({
    firstName : z.string(),
    lastName : z.string(),
    email : z.string().email(),
    password : z.string().min(6)
})
export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(6)
})


export type signinInput = z.infer<typeof signinInput>
export type signupInput = z.infer<typeof signupInput>