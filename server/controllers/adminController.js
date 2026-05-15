import Complaint from '../models/Complaint.js';

export const getStats = async (req, res) => {
  const [statusStats, categoryStats, priorityStats, total] = await Promise.all([
    Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
    Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Complaint.countDocuments(),
  ]);

  const byStatus = Object.fromEntries(
    statusStats.map((s) => [s._id, s.count])
  );
  const byCategory = Object.fromEntries(
    categoryStats.map((c) => [c._id, c.count])
  );
  const byPriority = Object.fromEntries(
    priorityStats.map((p) => [p._id, p.count])
  );

  res.status(200).json({
    success: true,
    stats: {
      total,
      pending: byStatus['Pending'] || 0,
      inProgress: byStatus['In Progress'] || 0,
      resolved: byStatus['Resolved'] || 0,
      rejected: byStatus['Rejected'] || 0,
      byStatus,
      byCategory,
      byPriority,
    },
  });
};

export const getAllComplaints = async (req, res) => {
  const { status, category, priority, from, to } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const complaints = await Complaint.find(filter)
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: complaints.length, complaints });
};
