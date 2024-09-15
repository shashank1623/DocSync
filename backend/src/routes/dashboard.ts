
import {Router} from "express";
import prisma from "./client";
import { verifyToken } from "../middleware/authMiddleware";

const dashboardRouter = Router();

//create a new document
dashboardRouter.post('/documents',verifyToken , async(req,res)=>{
    const {title , content} = req.body;

    try{

        const newDocumet = await prisma.document.create({
            data : {
                title ,
                content,
                ownerId : req.user.id
            }
        });

        res.status(201).json(newDocumet);
        
    }catch(error){
        console.log("Error Creating Doucment",error);
        res.status(500).json({
            error : "Unable to create document."
        });
    }
})
//Get a specific document Id
dashboardRouter.get("/documents/:id",verifyToken,async(req,res)=>{
    const {id} = req.params;
    try{
        const document = await prisma.document.findUnique({
            where : {id},
        });

        if(!document){
            res.status(404).json({
                error : "Document not found"
            })
        }

        //check if the user has acess to the document
        if(document.ownerId != req.user.id){
            return res.status(403).json({
                error : "Unauthorized access"
            })
        }

        res.status(403).json({
            error : "Unauthorized Access"
        });
    }catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ error: "Unable to fetch document." });
    }
})



//Update a dcoument by Id
dashboardRouter.put('/documents/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedDocument = await prisma.document.update({
            where: { id },
            data: { title, content }
        });

        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Unable to update document." });
    }
});

// Delete a document by ID
dashboardRouter.delete('/documents/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.document.delete({
            where: { id },
        });

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Unable to delete document." });
    }
});

export default dashboardRouter;