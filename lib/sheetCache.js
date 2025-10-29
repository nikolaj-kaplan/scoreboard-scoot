// Simple in-memory cache for Google Sheet data
// This will be shared across API routes in the same Node.js process

const cache = {
  data: null,
  timestamp: null,
  range: null
};

export function getCache(range) {
  if (cache.data && cache.range === range) {
    return {
      data: cache.data,
      timestamp: cache.timestamp,
      fromCache: true
    };
  }
  return null;
}

export function setCache(range, data) {
  cache.data = data;
  cache.range = range;
  cache.timestamp = new Date().toISOString();
  console.log(`Cache updated for range ${range} at ${cache.timestamp}`);
}

export function clearCache() {
  cache.data = null;
  cache.timestamp = null;
  cache.range = null;
  console.log('Cache cleared');
}

export function getCacheInfo() {
  return {
    hasData: !!cache.data,
    timestamp: cache.timestamp,
    range: cache.range
  };
}
