import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import { sendError } from "../lib/responseHelpers.js";

export const protectedRoutes = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return sendError(res, 401, "Missing access token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded?.id;
        const role = decoded?.role;

        let user;
        if (role === "customer") {
            user = await Customer.findById(userId);
            req.role = "customer";
        } else if (role === "admin") {
            user = await Admin.findById(userId).select("-passwordHash").lean();
            req.role = "admin";
        }

        if (!user) {
            return sendError(res, 401, "Access token is not valid or has expired");
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return sendError(res, 401, "Access token is not valid or has expired");
    }
};
