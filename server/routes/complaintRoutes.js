import express from 'express';
import {
  getComplaints,
  createComplaint,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getComplaints).post(uploadMedia, createComplaint);
router.route('/:id').get(getComplaintById);
router.patch('/:id/status', adminOnly, updateComplaintStatus);
router.delete('/:id', adminOnly, deleteComplaint);

export default router;
