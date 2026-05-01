/**
 * useAppointments — manages appointment list + stats fetching for AdminDashboard.
 * Accepts a filter string and returns appointments, stats, loading state,
 * and stable refetch callbacks.
 */
import { useState, useEffect, useCallback } from 'react';
import { getAdminAppointments, getAppointmentStats } from '../services/localStorageApi';

export function useAppointments(filter = 'all') {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await getAdminAppointments(params);
      setAppointments(data.appointments);
    } catch (err) {
      console.error('[useAppointments] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getAppointmentStats();
      setStats(data.stats);
    } catch (err) {
      console.error('[useAppointments] stats error:', err);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchAppointments();
    fetchStats();
  }, [fetchAppointments, fetchStats]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch]);

  return { appointments, stats, loading, refetch, fetchAppointments, fetchStats };
}
