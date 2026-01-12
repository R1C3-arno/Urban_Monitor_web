package com.urbanmonitor.domain.citizen.emergency.observer;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * OBSERVER PATTERN
 * ghhi log emergency event.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoggingEmergencyLocationObserver implements EmergencyLocationObserver {
    
    private final EmergencyLocationEventPublisher publisher;
    
    @PostConstruct
    public void init() {
        publisher.subscribe(this);
    }
    
    @Override
    public void onEmergencyLocationEvent(EmergencyLocationEvent event) {
        switch (event.getType()) {
            case CREATED -> log.info("Emergency created: {} - {} at {}",
                event.getLocation().getId(),
                event.getLocation().getEmergencyType(),
                event.getLocation().getAddress());
                
            case UPDATED -> log.info(" Emergency updated: {}",
                event.getLocation().getId());
                
            case STATUS_CHANGED -> log.info("Emergency {} status: {} -> {}",
                event.getLocation().getId(),
                event.getPreviousStatus(),
                event.getNewStatus());
                
            case RESOLVED -> log.info("Emergency resolved: {}",
                event.getLocation().getId());
                
            case DELETED -> log.info("Emergency deleted: {}",
                event.getLocation().getId());
        }
    }
}
