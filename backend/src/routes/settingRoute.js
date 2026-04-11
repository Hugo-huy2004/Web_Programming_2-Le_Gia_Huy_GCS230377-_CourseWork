import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js';

const router = express.Router();

router.get('/', getSettings);

router.put('/', requireAdminApiKey, updateSettings);

export default router;
