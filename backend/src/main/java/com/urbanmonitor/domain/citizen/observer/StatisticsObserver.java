// ============================================
// StatisticsObserver.java
// ============================================
package com.urbanmonitor.domain.citizen.observer;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
public class StatisticsObserver implements IncidentObserver {

    private final AtomicInteger createdCount = new AtomicInteger(0);
    private final AtomicInteger resolvedCount = new AtomicInteger(0);

    @Override
    public void onIncidentCreated(TrafficIncident incident) {
        int count = createdCount.incrementAndGet();
        log.debug("📊 Statistics: {} incidents created today", count);
    }

    @Override
    public void onIncidentResolved(TrafficIncident incident) {
        int count = resolvedCount.incrementAndGet();
        log.debug("📊 Statistics: {} incidents resolved today", count);
    }

    @Override
    public String getObserverName() {
        return "StatisticsObserver";
    }

    // ✅ Public getters for statistics
    public int getCreatedCount() {
        return createdCount.get();
    }

    public int getResolvedCount() {
        return resolvedCount.get();
    }

    public void reset() {
        createdCount.set(0);
        resolvedCount.set(0);
        log.info("📊 Statistics reset");
    }
}
