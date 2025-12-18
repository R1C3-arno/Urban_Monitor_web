package com.urbanmonitor.domain.citizen.emergency.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * OBSERVER PATTERN - Publisher/Subject
 */
@Component
@Slf4j
public class EmergencyLocationEventPublisher {
    
    private final List<EmergencyLocationObserver> observers = new CopyOnWriteArrayList<>();
    
    public void subscribe(EmergencyLocationObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
            log.info("Observer subscribed: {}", observer.getClass().getSimpleName());
        }
    }
    
    public void unsubscribe(EmergencyLocationObserver observer) {
        observers.remove(observer);
    }
    
    public void publish(EmergencyLocationEvent event) {
        log.debug("Publishing event: {} for location {}", event.getType(), 
            event.getLocation() != null ? event.getLocation().getId() : "null");
        
        for (EmergencyLocationObserver observer : observers) {
            try {
                observer.onEmergencyLocationEvent(event);
            } catch (Exception e) {
                log.error("Error notifying observer {}: {}", 
                    observer.getClass().getSimpleName(), e.getMessage());
            }
        }
    }
}
