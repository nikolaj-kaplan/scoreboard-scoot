// Custom hook for fetching and polling sheet data
import { useEffect, useState } from 'react';

export function useSheetData(intervalMs = 5000) {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(`/api/sheet`);
        const json = await res.json();
        
        if (mounted) {
          setAllData(json.data);
          setLoading(false);
          setError(null);
          
          // Log for debugging
          console.log(`📊 Sheet data received (${json.cached ? 'cached' : 'fresh'}):`, json);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoading(false);
          console.error('Error fetching sheet data:', e);
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, intervalMs);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return { allData, loading, error };
}
