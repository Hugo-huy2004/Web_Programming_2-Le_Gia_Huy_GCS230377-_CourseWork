import express from 'express';
import { createAppointment, listAppointments, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController.js';
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js';

const router = express.Router();

router.post('/', createAppointment);

router.get('/', requireAdminApiKey, listAppointments);
router.patch('/:id/status', requireAdminApiKey, updateAppointmentStatus);

router.delete('/:id', requireAdminApiKey, deleteAppointment);

export default router;
