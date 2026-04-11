import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export function hasValidAdminApiKey(req) {
    const incomingKey = req.header("x-admin-key");
    return Boolean(incomingKey) && incomingKey === env.adminApiKey;
}

async function hasValidAdminToken(req) {
    const authHeader = req.header("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
        return false;
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        if (!decoded?.id || decoded?.role !== "admin") {
            return false;
        }

        const admin = await Admin.findById(decoded.id).select("_id");
        return Boolean(admin);
    } catch {
        return false;
    }
}

export async function requireAdminApiKey(req, res, next) {
    if (hasValidAdminApiKey(req)) {
        return next();
    }

    const hasTokenAccess = await hasValidAdminToken(req);
    if (!hasTokenAccess) {
        return res.status(401).json({ ok: false, message: "Unauthorized admin request" });
    }

    return next();
}
