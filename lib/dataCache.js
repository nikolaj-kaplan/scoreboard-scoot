// Simple in-memory cache for the consolidated Out* sheets data
// NOTE: This cache lives only as long as the serverless instance (if deployed on Vercel it may be short-lived).
// Structure:
// {
//   data: { OutSheetName: [][] , ... }, // entire merged dataset
//   updatedAt: ISOString,               // when cache last replaced
//   source: 'webhook' | 'fetch',        // origin of the cached data
// }

let _cache = null;

export function getCache() {
  return _cache;
}

export function setCache(data, source = 'fetch') {
  _cache = {
    data,
    updatedAt: new Date().toISOString(),
    source
  };
  return _cache;
}

export function getCacheMeta() {
  if (!_cache) return { hasCache: false };
  const ageMs = Date.now() - new Date(_cache.updatedAt).getTime();
  return {
    hasCache: true,
    updatedAt: _cache.updatedAt,
    ageMs,
    source: _cache.source
  };
}

export function clearCache() {
  _cache = null;
}
