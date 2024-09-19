"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("./client"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardRouter = (0, express_1.Router)();
// Fetch all documents owned by or shared with the user
dashboardRouter.get("/documents", authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownedDocuments = yield client_1.default.document.findMany({
            where: { ownerId: req.user.id },
            include: {
                collaborators: true,
            },
        });
        // Fetch documents where the user is a collaborator
        const collaboratingDocuments = yield client_1.default.document.findMany({
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
    }
    catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Unable to fetch documents." });
    }
}));
// Create a new document
dashboardRouter.post('/documents', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    try {
        const newDocument = yield client_1.default.document.create({
            data: {
                title,
                content,
                ownerId: req.user.id,
            },
        });
        res.status(201).json(newDocument);
    }
    catch (error) {
        console.log("Error creating document", error);
        res.status(500).json({ error: "Unable to create document." });
    }
}));
// Get a specific document by ID
dashboardRouter.get("/documents/:id", authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({
                error: "Document not found"
            });
        }
        // Check if the user has access to the document
        if (document.ownerId !== req.user.id) {
            const collaborator = yield client_1.default.collaborator.findFirst({
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
    }
    catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ error: "Unable to fetch document." });
    }
}));
// Get a shared document with viewer or editor access
dashboardRouter.get("/documents/:id/shared", authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const accessType = req.query.access; // 'viewer' or 'editor'
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        // If the user is the owner, allow full access
        if (document.ownerId === req.user.id) {
            return res.status(200).json({
                title: document.title,
                content: document.content,
                readOnly: accessType === 'viewer',
            });
        }
        // Check for collaborator access
        const collaborator = yield client_1.default.collaborator.findFirst({
            where: {
                userId: req.user.id,
                documentId: id,
            },
        });
        if (!collaborator) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        // Handle viewer access
        if (accessType === 'viewer' && collaborator.role === 'VIEWER') {
            return res.status(200).json({
                title: document.title,
                content: document.content,
                readOnly: true,
            });
        }
        // Handle editor access
        if (accessType === 'editor' && collaborator.role === 'EDITOR') {
            return res.status(200).json({
                title: document.title,
                content: document.content,
                readOnly: false,
            });
        }
        // If the access type or role is invalid
        return res.status(403).json({ error: "Unauthorized or invalid access type." });
    }
    catch (error) {
        console.error("Error fetching shared document:", error);
        res.status(500).json({ error: "Unable to fetch document." });
    }
}));
// Update a document by ID
dashboardRouter.put('/documents/:id', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        // Ensure the user is the owner or an editor
        if (document.ownerId !== req.user.id) {
            const collaborator = yield client_1.default.collaborator.findFirst({
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
        const updatedDocument = yield client_1.default.document.update({
            where: { id },
            data: { title, content },
        });
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Unable to update document." });
    }
}));
// Delete a document by ID
dashboardRouter.delete('/documents/:id', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id },
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        // Ensure the user is the owner
        if (document.ownerId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        yield client_1.default.document.delete({
            where: { id },
        });
        res.status(200).json({ message: "Document deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Unable to delete document." });
    }
}));
exports.default = dashboardRouter;
//# sourceMappingURL=dashboard.js.map