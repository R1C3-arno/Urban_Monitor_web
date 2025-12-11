// ============================================
// IncidentSubject.java
// ============================================
package com.urbanmonitor.domain.citizen.observer;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * SUBJECT - Observer Pattern
 * Manages list of observers and notifies them
 */
@Slf4j
@Component
public class IncidentSubject {

    private final List<IncidentObserver> observers = new ArrayList<>();

    public void attach(IncidentObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
            log.info("➕ Observer attached: {}", observer.getObserverName());
        }
    }

    public void detach(IncidentObserver observer) {
        observers.remove(observer);
        log.info("➖ Observer detached: {}", observer.getObserverName());
    }

    public void notifyIncidentCreated(TrafficIncident incident) {
        log.debug("📣 Notifying {} observers: Incident created", observers.size());
        for (IncidentObserver observer : observers) {
            try {
                observer.onIncidentCreated(incident);
            } catch (Exception e) {
                log.error("❌ Error in observer {}: {}",
                        observer.getObserverName(), e.getMessage());
            }
        }
    }

    public void notifyIncidentResolved(TrafficIncident incident) {
        log.debug("📣 Notifying {} observers: Incident resolved", observers.size());
        for (IncidentObserver observer : observers) {
            try {
                observer.onIncidentResolved(incident);
            } catch (Exception e) {
                log.error("❌ Error in observer {}: {}",
                        observer.getObserverName(), e.getMessage());
            }
        }
    }

    public int getObserverCount() {
        return observers.size();
    }
}