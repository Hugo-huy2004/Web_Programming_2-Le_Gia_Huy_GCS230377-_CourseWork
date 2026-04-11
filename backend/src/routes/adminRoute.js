import express from 'express';
import { listAdmins, createAdminAccount } from '../controllers/adminController.js';
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js';

const router = express.Router();

// Admin-only routes to view & create admins
router.get('/', requireAdminApiKey, listAdmins);
router.post('/', requireAdminApiKey, createAdminAccount);

export default router;
