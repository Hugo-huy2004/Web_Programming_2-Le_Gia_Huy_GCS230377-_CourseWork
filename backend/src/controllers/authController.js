import Admin from "../models/Admin.js"
import Session from "../models/Session.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt";
import { sendError, sendSuccess } from "../lib/responseHelpers.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function toTrimmedText(value) {
    return String(value ?? "").trim();
}

function normalizeUsername(username) {
    return toTrimmedText(username).toLowerCase();
}

function setRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: SESSION_DURATION_MS
    });
}

export const adminLogin = async (req, res) => {
    try {
        const username = toTrimmedText(req.body?.username);
        const password = toTrimmedText(req.body?.password);

        if (!username || !password) {
            return sendError(res, 400, "Please enter both username and password.");
        }

        const normalizedUsername = normalizeUsername(username);

        const admin = await Admin.findOne({ username: normalizedUsername });
        if (!admin) {
            return sendError(res, 401, "Invalid credentials. Please try again.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordCorrect) {
            return sendError(res, 401, "Invalid credentials. Please try again.");
        }

        const accessToken = jwt.sign(
            { id: admin._id, role: "admin" }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        const refreshToken = crypto.randomBytes(64).toString("hex");

        await Session.create({
            userId: admin._id,
            userType: "Admin",
            refreshToken,
            expiresAt: Date.now() + SESSION_DURATION_MS
        });

        setRefreshTokenCookie(res, refreshToken);

        return sendSuccess(res, 200, { accessToken });

    } catch (error) {
        console.error("Critical Login Error:", error);
        return sendError(res, 500, "An unexpected server error occurred.");
    }
}

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await Session.findOneAndDelete({ refreshToken });
            res.clearCookie("refreshToken");
        }
        
        return sendSuccess(res, 200, { message: "You have been logged out successfully." });
    } catch (error) {
        console.error("Logout Error:", error);
        return sendError(res, 500, "Server error during logout.");
    }
}

export const fetchMe = async (req, res) => {
    try {
        const user = req?.user;
        const role = req?.role;
        if (!user) {
            return sendError(res, 404, "User not found.");
        }
        return sendSuccess(res, 200, { user, role });
    } catch (error) {
        console.error("Fetch Profile Error:", error);
        return sendError(res, 500, "Server error while fetching profile.");
    }
}