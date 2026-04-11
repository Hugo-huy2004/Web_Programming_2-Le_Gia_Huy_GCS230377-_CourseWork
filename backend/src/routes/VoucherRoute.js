import express from 'express';
import { listVouchers, createVoucher, toggleVoucherStatus, deleteVoucher } from '../controllers/voucherController.js';
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js';

const router = express.Router();

router.get('/', listVouchers);

router.post('/', requireAdminApiKey, createVoucher);
router.patch('/:id/toggle', requireAdminApiKey, toggleVoucherStatus);
router.delete('/:id', requireAdminApiKey, deleteVoucher);

export default router;
