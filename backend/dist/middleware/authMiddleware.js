"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    //console.log(token);
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decode.id }; // Add the decoded JWT payload to req.user
        next();
    }
    catch (error) {
        return res.status(400).json({
            error: "Invalid Token"
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authMiddleware.js.map