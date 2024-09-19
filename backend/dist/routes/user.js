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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const docsync_1 = require("@alias1623/docsync");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
userRouter.get('/info', (req, res) => {
    res.send("Bhai mai user Router hu!");
});
//signup logic (user Registration)
userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    const { success } = docsync_1.signupInput.safeParse({ firstName, lastName, email, password });
    if (!success) {
        return res.status(411).json({
            message: "Inputs are not Correct"
        });
    }
    try {
        //check if user already exists
        const existingUser = yield client_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email." });
        }
        // Hash the password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Hash the Password
        //create the user in the database
        const newUser = yield client_1.default.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword
            }
        });
        // Generate JWT token with 7 days expiry
        const token = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
        // return the sucess response
        res.status(201).json({
            email: newUser.email,
            name: newUser.name,
            token
        });
    }
    catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Something went wrong during registration." });
    }
}));
userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { success } = docsync_1.signinInput.safeParse({ email, password });
    if (!success) {
        return res.status(411).json({
            message: "Inputs are not Correct"
        });
    }
    try {
        //check if the user exists or not
        const user = yield client_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // Generate JWT token with 7 days expiry
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        //if the user is authentication return a sucess response
        res.status(200).json({
            email: user.email,
            name: user.name,
            token
        });
    }
    catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({ error: "Something went wrong during login." });
    }
}));
exports.default = userRouter;
//# sourceMappingURL=user.js.map