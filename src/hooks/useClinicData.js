/**
 * useClinicData — fetches clinic info, doctors and services in a single
 * parallel call and caches the result in module-level memory so subsequent
 * mounts (e.g. after navigation) are instant.
 */
import { useState, useEffect } from 'react';
import { getClinic, getDoctors, getServices } from '../services/localStorageApi';

// Module-level cache — shared across all component instances
let cache = null;

export function useClinicData() {
  const [data, setData] = useState(cache ?? { clinic: null, doctors: [], services: null });
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return; // Already loaded — nothing to do

    let cancelled = false;
    setLoading(true);

    Promise.all([getClinic(), getDoctors(), getServices()])
      .then(([clinic, doctors, services]) => {
        if (cancelled) return;
        const result = { clinic, doctors, services };
        cache = result;
        setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useClinicData]', err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
