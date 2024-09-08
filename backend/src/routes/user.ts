
import { Router } from "express";
import prisma from "./client";
const userRouter = Router();


userRouter.get('/info', (req,res)=>{
    res.send("Bhai mai user Router hu!");
})
//signup logic (user Registration)
userRouter.post('/signup',async (req,res)=>{
    const {firstName , lastName , email , password } = req.body;

    try{

        //create the user in the database
        const newUser = await prisma.user.create({
            data : {
                name : `${firstName} ${lastName}`,
                email,
                password
            }

        })

        // return the sucess response
        res.status(201).json({
            id : newUser.id,
            name : newUser.name
        })
    }catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Something went wrong during registration." });
    }
})
export default userRouter;