using System;
using System.Runtime.Caching;

namespace ConsoleApp_for_Self_Hosted_WS.Services
{
    public class GenericCache<T> where T : class, new()
    {
        private MemoryCache _cache = new MemoryCache("GenericCache");
        public DateTimeOffset dt_default = ObjectCache.InfiniteAbsoluteExpiration;

        public T Get(string cacheKey)
        {
            Console.WriteLine($"Get called with cacheKey: {cacheKey}");
            if (_cache.Contains(cacheKey))
            {
                Console.WriteLine("Cache contains the itinerary");
                return (T)_cache.Get(cacheKey);
            }
            Console.WriteLine("Cache does not contain the itinerary");
            return null;
        }

        public T Get(string cacheKey, double dt_seconds)
        {
            if (_cache.Contains(cacheKey))
            {
                return (T)_cache.Get(cacheKey);
            }
            return null;
        }

        public T Get(string cacheKey, DateTimeOffset dt)
        {
            if (_cache.Contains(cacheKey))
            {
                return (T)_cache.Get(cacheKey);
            }
            return null;
        }
        public void Add(string cacheKey, T data, DateTimeOffset dt)
        {
            Console.WriteLine($"Add called with cacheKey: {cacheKey}");
            Console.WriteLine("add to the cache");
            _cache.Set(cacheKey, data, dt);
        }

    }
}
