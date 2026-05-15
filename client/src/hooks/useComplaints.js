import { useComplaintContext } from '../context/ComplaintContext';

export function useComplaints() {
  return useComplaintContext();
}
