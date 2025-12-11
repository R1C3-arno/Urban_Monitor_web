package com.urbanmonitor.domain.citizen.cache;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import lombok.RequiredArgsConstructor;

/**
 * CACHE CONFIGURATION
 *
 * Features:
 * ========
 * - Auto-clear cache periodically (prevent stale data)
 * - Log cache statistics
 * - Health monitoring
 *
 * Schedule:
 * ========
 * - Stats logging: Every 5 minutes
 * - Cache refresh: Every 30 minutes (optional)
 */
@Slf4j
@EnableScheduling
@RequiredArgsConstructor
@Configuration("citizenCacheConfig")
public class CacheConfig {

    private final RouteLRUCache routeCache;

    /**
     * Log cache statistics every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void logCacheStats() {
        RouteLRUCache.CacheStats stats = routeCache.getStats();

        log.info("📊 Cache Stats - Size: {}/{}, Hits: {}, Misses: {}, Hit Rate: {:.2f}%, Utilization: {}",
                stats.getSize(),
                stats.getMaxSize(),
                stats.getHits(),
                stats.getMisses(),
                stats.getHitRate() * 100,
                stats.getUtilization()
        );
    }

    /**
     * Optional: Clear cache periodically to ensure fresh data
     * Uncomment if you want auto-refresh
     */
    // @Scheduled(cron = "0 0 */2 * * *") // Every 2 hours
    // public void scheduledCacheClear() {
    //     log.info("🔄 Scheduled cache refresh");
    //     routeCache.clear();
    // }

    /**
     * Clear cache when graph is rebuilt
     * Call this method after graph updates
     */
    public void onGraphUpdate() {
        log.info("🔄 Graph updated - clearing route cache");
        routeCache.clear();
    }
}