using System;
using System.Diagnostics;
using System.Net.Http;
using System.Runtime.Caching;
using System.Threading.Tasks;

namespace ProxyAndCache
{
    public class GenericCache<T> where T : class
    {
        private readonly ObjectCache _cache = MemoryCache.Default;
        public DateTimeOffset DtDefault { get; set; } = ObjectCache.InfiniteAbsoluteExpiration;

        // Get with default expiration
        public Task<T> Get(string cacheItemName)
        {
            return GetWithDateTimeOffset(cacheItemName, DtDefault);
        }

        // Get with expiration in seconds
        public Task<T> GetWithExpiration(string cacheItemName, double dtSeconds)
        {
            return GetWithDateTimeOffset(cacheItemName, DateTimeOffset.Now.AddSeconds(dtSeconds));
        }

        // Get with a specific expiration time
        public async Task<T> GetWithDateTimeOffset(string cacheItemName, DateTimeOffset dt)
        {
            if (!_cache.Contains(cacheItemName))
            {
                Console.WriteLine($"Cache miss for: {cacheItemName}");
                return null;
            }
            Console.WriteLine($"Cache hit for: {cacheItemName}");
            return (T)_cache.Get(cacheItemName);
        }

        // Add data to cache
        public void Add(string cacheItemName, T data, DateTimeOffset expirationTime)
        {
            if (data == null)
            {
                Trace.WriteLine($"[Cache] Attempted to add null data for key: {cacheItemName}");
                throw new ArgumentNullException(nameof(data), "Data cannot be null");
            }

            Trace.WriteLine($"[Cache] Adding key: {cacheItemName} with expiration: {expirationTime}");
            _cache.Set(cacheItemName, data, expirationTime);

            if (_cache.Contains(cacheItemName))
            {
                Trace.WriteLine($"[Cache] Successfully added key: {cacheItemName}");
            }
            else
            {
                Trace.WriteLine($"[Cache] Failed to add key: {cacheItemName}");
            }
        }
    }
}
