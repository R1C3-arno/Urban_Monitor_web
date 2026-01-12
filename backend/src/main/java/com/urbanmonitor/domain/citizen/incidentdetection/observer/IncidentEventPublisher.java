package com.urbanmonitor.domain.citizen.incidentdetection.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * OBSERVER PATTERN
 */
@Component
@Slf4j
public class IncidentEventPublisher {

    private final List<IncidentObserver> observers = new CopyOnWriteArrayList<>();

    public void subscribe(IncidentObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
            log.info("Observer subscribed: {}", observer.getClass().getSimpleName());
        }
    }

    public void unsubscribe(IncidentObserver observer) {
        observers.remove(observer);
    }

    public void publish(IncidentEvent event) {
        log.debug("Publishing event: {} for incident {}", event.getType(),
            event.getIncident() != null ? event.getIncident().getId() : "null");

        for (IncidentObserver observer : observers) {
            try {
                observer.onIncidentEvent(event);
            } catch (Exception e) {
                log.error("Error notifying observer: {}", e.getMessage());
            }
        }
    }
}
