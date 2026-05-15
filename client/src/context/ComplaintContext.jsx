import { createContext, useContext, useState, useCallback } from 'react';
import { complaintAPI, adminAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext(null);

export function ComplaintProvider({ children }) {
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = isAdmin
        ? await adminAPI.getComplaints(filters)
        : await complaintAPI.getAll();
      setComplaints(data.complaints || []);
      return data.complaints;
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchStats = useCallback(async () => {
    const { data } = await adminAPI.getStats();
    setStats(data.stats);
    return data.stats;
  }, []);

  const getComplaint = async (id) => {
    const { data } = await complaintAPI.getById(id);
    return data.complaint;
  };

  const submitComplaint = async (formData) => {
    const { data } = await complaintAPI.create(formData);
    setComplaints((prev) => [data.complaint, ...prev]);
    return data.complaint;
  };

  const updateStatus = async (id, payload) => {
    const { data } = await complaintAPI.updateStatus(id, payload);
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? data.complaint : c))
    );
    return data.complaint;
  };

  const removeComplaint = async (id) => {
    await complaintAPI.delete(id);
    setComplaints((prev) => prev.filter((c) => c._id !== id));
  };

  const value = {
    complaints,
    stats,
    loading,
    fetchComplaints,
    fetchStats,
    getComplaint,
    submitComplaint,
    updateStatus,
    removeComplaint,
    setComplaints,
  };

  return (
    <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>
  );
}

export const useComplaintContext = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error('useComplaintContext must be used within ComplaintProvider');
  return ctx;
};
