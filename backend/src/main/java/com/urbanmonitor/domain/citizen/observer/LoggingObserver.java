// ============================================
// LoggingObserver.java
// ============================================
package com.urbanmonitor.domain.citizen.observer;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LoggingObserver implements IncidentObserver {

    @Override
    public void onIncidentCreated(TrafficIncident incident) {
        log.info("📢 NEW INCIDENT CREATED: {} at ({}, {}) - Level: {}",
                incident.getTitle(),
                incident.getLat(),
                incident.getLng(),
                incident.getLevel());
    }

    @Override
    public void onIncidentResolved(TrafficIncident incident) {
        log.info("✅ INCIDENT RESOLVED: {} (ID: {}) - Duration: {} ",
                incident.getTitle(),
                incident.getId(),
                java.time.Duration.between(incident.getCreatedAt(),
                        incident.getResolvedAt()));
    }

    @Override
    public String getObserverName() {
        return "LoggingObserver";
    }
}