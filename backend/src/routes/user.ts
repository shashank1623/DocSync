
import { Router } from "express";
import prisma from "./client";
import bcrypt from "bcryptjs";
const userRouter = Router();


userRouter.get('/info', (req,res)=>{
    res.send("Bhai mai user Router hu!");
})
//signup logic (user Registration)
userRouter.post('/signup',async (req,res)=>{
    const {firstName , lastName , email , password } = req.body;

    try{

        //check if user already exists
        const existingUser = await prisma.user.findUnique({
            where : {email}
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email." });
        }

         // Hash the password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        // Hash the Password

        //create the user in the database
        const newUser = await prisma.user.create({
            data : {
                name : `${firstName} ${lastName}`,
                email,
                password : hashedPassword
            }

        })

        // return the sucess response
        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        })
    }catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Something went wrong during registration." });
    }
})
export default userRouter;