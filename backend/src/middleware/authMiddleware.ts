
import { Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface JwtPayload{
    id : string;
}

export const verifyToken = (req : Request , res : Response , next : NextFunction) =>{
    const token = req.header("Authorization")
    console.log(token);

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try{
        const decode = jwt.verify(token,JWT_SECRET) as JwtPayload;
        req.user = decode;
        next()
    }catch(error){
        return res.status(400).json({
            error : "Invalid Token"
        })
    }
}