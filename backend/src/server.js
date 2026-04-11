import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js"
import authRoute from './routes/authRoute.js'
import { protectedRoutes } from './middlewares/authMiddlewares.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import uploadsRoute from './routes/uploadsRoute.js';
import customerRoute from './routes/customerRoute.js';
import appointmentRoute from './routes/appointmentRoute.js';
import adminRoute from './routes/adminRoute.js';
import settingRoute from './routes/settingRoute.js';
import voucherRoute from './routes/VoucherRoute.js';
import orderRoute from './routes/orderRoute.js';
import supportTicketRoute from './routes/supportTicketRoute.js';
import { apiRateLimiter, authRateLimiter } from './middlewares/rateLimitMiddleware.js';
import { env } from './config/env.js';


dotenv.config();
const PORT = env.port || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (env.clientOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
}));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Backend is connected" });
});

app.use("/api", apiRateLimiter);

//public routes
app.use("/api/auth", authRateLimiter, authRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/customers", customerRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/admins", adminRoute);
app.use("/api/settings", settingRoute);
app.use("/api/vouchers", voucherRoute);
app.use("/api/orders", orderRoute);
app.use("/api/support/tickets", supportTicketRoute);
app.use("/api/products", productRoute);

//private routes
app.use("/api/user", protectedRoutes, userRoute);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on', PORT);
    });
}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

