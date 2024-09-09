
import { Router } from "express";
import prisma from "./client";
import bcrypt from "bcryptjs";
import { signinInput , signupInput } from "@alias1623/docsync";
const userRouter = Router();


userRouter.get('/info', (req,res)=>{
    res.send("Bhai mai user Router hu!");
})
//signup logic (user Registration)
userRouter.post('/signup',async (req,res)=>{
    const {firstName , lastName , email , password } = req.body;
    const {success} = signupInput.safeParse({firstName,lastName,email,password});

    if(!success){
        return res.status(411).json({
          message : "Inputs are not Correct"
        })
      }

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

userRouter.post('/signin' , async (req,res)=>{

    const {email,password} = req.body;
    const {success} = signinInput.safeParse({email,password});

    if(!success){
        return res.status(411).json({
          message : "Inputs are not Correct"
        })
      }

    try{
        //check if the user exists or not
        const user = await prisma.user.findUnique({
            where : {email}
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //if the user is authentication return a sucess response
        res.status(200).json({
            message : "Login sucessful",
            user : {
                id :  user.id,
                email : user.email,
                name : user.name
            }
        })
    }catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({ error: "Something went wrong during login." });
    }
    
})
export default userRouter;