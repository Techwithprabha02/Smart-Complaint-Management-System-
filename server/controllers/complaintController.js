import Complaint from '../models/Complaint.js';
import { detectPriority } from '../utils/aiPriority.js';

export const getComplaints = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { submittedBy: req.user._id };

  const complaints = await Complaint.find(filter)
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: complaints.length, complaints });
};

export const createComplaint = async (req, res) => {
  const { title, description, category, location } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  let parsedLocation = location;
  if (typeof location === 'string') {
    try {
      parsedLocation = JSON.parse(location);
    } catch {
      return res.status(400).json({ message: 'Invalid location format' });
    }
  }

  const mediaUrls = req.files?.map((file) => file.path) || [];

  const priority = await detectPriority(title, description);

  const complaint = await Complaint.create({
    title,
    description,
    category,
    location: parsedLocation,
    mediaUrls,
    priority,
    submittedBy: req.user._id,
  });

  const populated = await Complaint.findById(complaint._id).populate(
    'submittedBy',
    'name email'
  );

  res.status(201).json({ success: true, complaint: populated });
};

export const getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(
    'submittedBy',
    'name email'
  );

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  if (
    req.user.role !== 'admin' &&
    complaint.submittedBy._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json({ success: true, complaint });
};

export const updateComplaintStatus = async (req, res) => {
  const { status, adminNote } = req.body;

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  if (status) complaint.status = status;
  if (adminNote !== undefined) complaint.adminNote = adminNote;

  await complaint.save();

  const updated = await Complaint.findById(complaint._id).populate(
    'submittedBy',
    'name email'
  );

  res.status(200).json({ success: true, complaint: updated });
};

export const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  await complaint.deleteOne();
  res.status(200).json({ success: true, message: 'Complaint deleted' });
};
