import express from 'express';
import { createOrder, listOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', listOrders);

router.patch('/:id/status', requireAdminApiKey, updateOrderStatus);

router.delete('/:id', requireAdminApiKey, deleteOrder);

export default router;
