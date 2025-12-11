package com.urbanmonitor.domain.citizen.cache;

import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * LRU CACHE FOR ROUTES
 *
 * DSA Applied:
 * ===========
 * - LinkedHashMap with access-order (LRU eviction)
 * - O(1) get/put operations
 * - Thread-safe with ReadWriteLock
 *
 * Design Pattern:
 * ==============
 * - Cache Pattern
 * - Singleton (via @Component)
 *
 * Benefits:
 * ========
 * - Avoid recalculating same routes
 * - Huge performance boost for popular routes
 * - Memory efficient with max size limit
 *
 * Usage:
 * =====
 *RouteResponse cached = routeCache.get(1L, 5L, "dijkstra");
 * if (cached != null) return cached;
 *
 * RouteResponse fresh = calculate(...);
 * routeCache.put(1L, 5L, "dijkstra", fresh);
 */
@Slf4j
@Component
public class RouteLRUCache {

    private final int maxSize;
    private final Map<String, RouteResponse> cache;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    // Statistics
    private long hits = 0;
    private long misses = 0;

    public RouteLRUCache(@Value("${cache.route.max-size:100}") int maxSize) {
        this.maxSize = maxSize;

        // DSA: LinkedHashMap with access-order = true
        // → Automatically maintains LRU order
        this.cache = new LinkedHashMap<String, RouteResponse>(maxSize, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, RouteResponse> eldest) {
                boolean shouldRemove = size() > RouteLRUCache.this.maxSize;
                if (shouldRemove) {
                    log.debug("🗑️ LRU eviction: {}", eldest.getKey());
                }
                return shouldRemove;
            }
        };

        log.info("✅ RouteLRUCache initialized with max size: {}", maxSize);
    }

    /**
     * Get cached route
     * Time Complexity: O(1)
     */
    public RouteResponse get(Long startNodeId, Long endNodeId, String algorithm) {
        String key = buildKey(startNodeId, endNodeId, algorithm);

        lock.readLock().lock();
        try {
            RouteResponse result = cache.get(key);

            if (result != null) {
                hits++;
                log.debug("🎯 Cache HIT: {} (hit rate: {:.2f}%)",
                        key, getHitRate() * 100);
                return result;
            } else {
                misses++;
                log.debug("❌ Cache MISS: {} (hit rate: {:.2f}%)",
                        key, getHitRate() * 100);
                return null;
            }
        } finally {
            lock.readLock().unlock();
        }
    }

    /**
     * Put route into cache
     * Time Complexity: O(1)
     */
    public void put(Long startNodeId, Long endNodeId, String algorithm, RouteResponse route) {
        if (route == null || route.getError() != null) {
            log.debug("⚠️ Not caching error response");
            return;
        }

        String key = buildKey(startNodeId, endNodeId, algorithm);

        lock.writeLock().lock();
        try {
            cache.put(key, route);
            log.debug("💾 Cached route: {} (cache size: {})", key, cache.size());
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Invalidate specific route
     */
    public void invalidate(Long startNodeId, Long endNodeId, String algorithm) {
        String key = buildKey(startNodeId, endNodeId, algorithm);

        lock.writeLock().lock();
        try {
            cache.remove(key);
            log.info("🗑️ Invalidated cache: {}", key);
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Clear entire cache
     * Use when: graph structure changes, edges updated, etc.
     */
    public void clear() {
        lock.writeLock().lock();
        try {
            int oldSize = cache.size();
            cache.clear();
            hits = 0;
            misses = 0;
            log.info("🧹 Cache cleared (removed {} entries)", oldSize);
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Get cache statistics
     */
    public CacheStats getStats() {
        lock.readLock().lock();
        try {
            return CacheStats.builder()
                    .size(cache.size())
                    .maxSize(maxSize)
                    .hits(hits)
                    .misses(misses)
                    .hitRate(getHitRate())
                    .build();
        } finally {
            lock.readLock().unlock();
        }
    }

    /**
     * Build cache key
     * Format: "start-end-algorithm"
     */
    private String buildKey(Long startNodeId, Long endNodeId, String algorithm) {
        return String.format("%d-%d-%s", startNodeId, endNodeId,
                algorithm != null ? algorithm.toLowerCase() : "dijkstra");
    }

    /**
     * Calculate hit rate
     */
    private double getHitRate() {
        long total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }

    /**
     * Cache statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class CacheStats {
        private int size;
        private int maxSize;
        private long hits;
        private long misses;
        private double hitRate;

        public String getUtilization() {
            return String.format("%.1f%%", (double) size / maxSize * 100);
        }
    }
}