package com.urbanmonitor.domain.citizen.disasterMonitor.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * OBSERVER PATTERN - Subject/Publisher
 * Quản lý và notify các observers khi có disaster zone events.
 * Thread-safe với CopyOnWriteArrayList.
 */
@Component
@Slf4j
public class DisasterZoneEventPublisher {
    
    private final List<DisasterZoneObserver> observers = new CopyOnWriteArrayList<>();
    
    /**
     * Register an observer
     */
    public void subscribe(DisasterZoneObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
            log.info("Observer subscribed: {}", observer.getClass().getSimpleName());
        }
    }
    
    /**
     * Unregister an observer
     */
    public void unsubscribe(DisasterZoneObserver observer) {
        observers.remove(observer);
        log.info("Observer unsubscribed: {}", observer.getClass().getSimpleName());
    }
    
    /**
     * Notify all observers about an event
     */
    public void publish(DisasterZoneEvent event) {
        log.debug("Publishing event: {} for zone {}", event.getType(), event.getZone().getId());
        
        for (DisasterZoneObserver observer : observers) {
            try {
                observer.onDisasterZoneEvent(event);
            } catch (Exception e) {
                log.error("Error notifying observer {}: {}", 
                    observer.getClass().getSimpleName(), e.getMessage());
            }
        }
    }
    
    /**
     * Get number of registered observers
     */
    public int getObserverCount() {
        return observers.size();
    }
}
