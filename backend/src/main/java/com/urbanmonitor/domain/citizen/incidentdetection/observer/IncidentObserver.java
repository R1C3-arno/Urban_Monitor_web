package com.urbanmonitor.domain.citizen.incidentdetection.observer;

/**
 * OBSERVER PATTERN
 */
public interface IncidentObserver {
    void onIncidentEvent(IncidentEvent event);
}
