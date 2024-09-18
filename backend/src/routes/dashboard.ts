import { Router } from "express";
import prisma from "./client";
import { verifyToken } from "../middleware/authMiddleware";

const dashboardRouter = Router();

// Fetch all documents owned by or shared with the user
dashboardRouter.get("/documents", verifyToken, async (req, res) => {
  try {
    const ownedDocuments = await prisma.document.findMany({
      where: { ownerId: req.user.id },
      include: {
        collaborators: true,
      },
    });

    // Fetch documents where the user is a collaborator
    const collaboratingDocuments = await prisma.document.findMany({
      where: {
        collaborators: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        collaborators: true, // Include collaborator data in the response
      },
    });

    // Combine both results
    const allDocuments = [...ownedDocuments, ...collaboratingDocuments];

    res.status(200).json(allDocuments);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Unable to fetch documents." });
  }
});

// Create a new document
dashboardRouter.post('/documents', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newDocument = await prisma.document.create({
      data: {
        title,
        content,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(newDocument);
  } catch (error) {
    console.log("Error creating document", error);
    res.status(500).json({ error: "Unable to create document." });
  }
});

// Get a specific document by ID
dashboardRouter.get("/documents/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    // Check if the user has access to the document
    if (document.ownerId !== req.user.id) {
      const collaborator = await prisma.collaborator.findFirst({
        where: {
          userId: req.user.id,
          documentId: id,
          role: 'EDITOR',
        },
      });

      if (!collaborator) {
        return res.status(403).json({
          error: "Unauthorized access"
        });
      }
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Unable to fetch document." });
  }
});

// Get a specific document by ID with access control (viewer/editor)
dashboardRouter.get("/documents/:id/shared", verifyToken, async (req, res) => {
  const { id } = req.params;
  const accessType = req.query.access as string; // 'viewer' or 'editor'

  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check viewer access: viewers can only read the document
    if (accessType === 'viewer') {
      return res.status(200).json({
        title: document.title,
        content: document.content,
        readOnly: true,
      });
    }

    // Check editor access: only collaborators with EDITOR role can modify
    if (accessType === 'editor') {
      // Ensure the user is a collaborator with EDITOR role
      const collaborator = await prisma.collaborator.findFirst({
        where: {
          userId: req.user.id,
          documentId: id,
          role: 'EDITOR',
        },
      });

      if (!collaborator && document.ownerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access: Not an editor" });
      }

      return res.status(200).json({
        title: document.title,
        content: document.content,
        readOnly: false,
      });
    }

    // Handle invalid access type
    return res.status(400).json({ error: "Invalid access type." });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Unable to fetch document." });
  }
});

// Update a document by ID
dashboardRouter.put('/documents/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Ensure the user is the owner or an editor
    if (document.ownerId !== req.user.id) {
      const collaborator = await prisma.collaborator.findFirst({
        where: {
          userId: req.user.id,
          documentId: id,
          role: 'EDITOR',
        },
      });

      if (!collaborator) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { title, content },
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
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Ensure the user is the owner
    if (document.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

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
