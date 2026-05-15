export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const CATEGORY_ICONS = {
  Water: '💧',
  Electricity: '⚡',
  Garbage: '🗑️',
  Road: '🛣️',
  Other: '📋',
};

export const CATEGORY_COLORS = {
  Water: '#2563EB',
  Electricity: '#D97706',
  Garbage: '#16A34A',
  Road: '#64748B',
  Other: '#7C3AED',
};

export const STATUS_STEPS = ['Pending', 'In Progress', 'Resolved'];

export const isVideoUrl = (url) =>
  /\.(mp4|mov|webm)(\?|$)/i.test(url) || url.includes('/video/');
