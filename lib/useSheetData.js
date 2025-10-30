// Custom hook for fetching sheet data and listening for real-time updates via Pusher
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export function useSheetData() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let pusher;
    let channel;

    async function fetchData() {
      try {
        console.log('📡 Fetching initial sheet data...');
        const res = await fetch(`/api/sheet`);
        const json = await res.json();
        
        if (mounted) {
          setAllData(json.data);
          setLoading(false);
          setError(null);
          console.log('📊 Initial sheet data loaded:', json);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoading(false);
          console.error('Error fetching sheet data:', e);
        }
      }
    }

    // Initial fetch
    fetchData();

    // Initialize Pusher connection
    pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu'
    });

    // Subscribe to the sheet-updates channel
    channel = pusher.subscribe('sheet-updates');

    // Listen for sheet-update events
    channel.bind('sheet-update', ({ data, timestamp }) => {
      if (mounted) {
        console.log('\n🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔔 REAL-TIME UPDATE RECEIVED FROM PUSHER');
        console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Timestamp:', timestamp);
        console.log('Sheets received:', Object.keys(data).join(', '));
        console.log('Total rows:', Object.values(data).reduce((sum, rows) => sum + rows.length, 0));
        console.log('Updating UI now...');
        console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        setAllData(data);
        setError(null);
      }
    });

    pusher.connection.bind('connected', () => {
      console.log('🔌 Pusher connected');
    });

    pusher.connection.bind('disconnected', () => {
      console.log('🔌 Pusher disconnected');
    });

    return () => {
      mounted = false;
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, []);

  return { allData, loading, error };
}
