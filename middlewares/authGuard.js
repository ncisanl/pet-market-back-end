import "dotenv/config";
import jwt from "jsonwebtoken";

export const authGuard = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Token inválido" });
    }
};