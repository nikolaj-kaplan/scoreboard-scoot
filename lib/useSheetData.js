// Custom hook for fetching sheet data and listening for real-time updates via Pusher
import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';

export function useSheetData() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dataUpdated, setDataUpdated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1);
  }, []);

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

    // Listen for sheet-update events (includes timeline)
    channel.bind('sheet-update', (payload) => {
      if (!mounted) return;
      const { data, timeline } = payload;
      const uiReceiveAt = new Date();
      // Extract timeline points
      const triggerAt = timeline?.triggerAt ? new Date(timeline.triggerAt) : null;
      const collectedAt = timeline?.collectedAt ? new Date(timeline.collectedAt) : null;
      const webhookSendStartAt = timeline?.webhookSendStartAt ? new Date(timeline.webhookSendStartAt) : null;
      const serverReceivedAt = timeline?.serverReceivedAt ? new Date(timeline.serverReceivedAt) : null;
      const serverBroadcastAt = timeline?.serverBroadcastAt ? new Date(timeline.serverBroadcastAt) : null;

      // Compute durations (ms)
      function diff(a, b) { return (a && b) ? (b - a) : null; }
      const durations = {
        sheetCollection: diff(triggerAt, collectedAt),
        webhookNetwork: diff(webhookSendStartAt, serverReceivedAt),
        serverProcessing: diff(serverReceivedAt, serverBroadcastAt),
        broadcastToClient: diff(serverBroadcastAt, uiReceiveAt),
        endToEnd: diff(triggerAt, uiReceiveAt)
      };

      console.log('\n🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔔 REAL-TIME UPDATE RECEIVED FROM PUSHER');
      console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Sheets:', Object.keys(data).join(', '));
      console.log('Total rows:', Object.values(data).reduce((sum, rows) => sum + rows.length, 0));
      console.log('Timeline ISO:');
      console.log('  triggerAt:        ', triggerAt?.toISOString());
      console.log('  collectedAt:      ', collectedAt?.toISOString());
      console.log('  webhookSendStart: ', webhookSendStartAt?.toISOString());
      console.log('  serverReceivedAt: ', serverReceivedAt?.toISOString());
      console.log('  serverBroadcastAt:', serverBroadcastAt?.toISOString());
      console.log('  uiReceiveAt:      ', uiReceiveAt.toISOString());
      console.log('Durations (ms):');
      Object.entries(durations).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
      console.log('Updating UI now...');
      console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      setAllData(data);
      setError(null);
      setDataUpdated(true);
      setTimeout(() => setDataUpdated(false), 2000); // Reset after 2 seconds
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
  }, [refreshTrigger]);

  return { allData, loading, error, refresh, dataUpdated };
}
