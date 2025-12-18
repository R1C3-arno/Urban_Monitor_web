package com.urbanmonitor.domain.citizen.disasterMonitor.observer;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * OBSERVER PATTERN - Concrete Observer
 * 
 * Sample observer that logs disaster zone events.
 * Có thể dễ dàng thêm các observers khác như:
 * - NotificationObserver: Gửi notification đến users
 * - CacheInvalidationObserver: Invalidate cache khi data thay đổi
 * - AuditLogObserver: Ghi audit log
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoggingDisasterZoneObserver implements DisasterZoneObserver {
    
    private final DisasterZoneEventPublisher publisher;
    
    @PostConstruct
    public void init() {
        publisher.subscribe(this);
    }
    
    @Override
    public void onDisasterZoneEvent(DisasterZoneEvent event) {
        switch (event.getType()) {
            case CREATED -> log.info("Disaster zone created: {} - {} in {}",
                event.getZone().getId(),
                event.getZone().getDisasterType(),
                event.getZone().getRegion());
                
            case UPDATED -> log.info("Disaster zone updated: {}",
                event.getZone().getId());
                
            case STATUS_CHANGED -> log.info("Disaster zone {} status changed: {} -> {}",
                event.getZone().getId(),
                event.getPreviousStatus(),
                event.getNewStatus());
                
            case DELETED -> log.info("Disaster zone deleted: {}",
                event.getZone().getId());
        }
    }
}
