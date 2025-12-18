package com.urbanmonitor.domain.citizen.incidentdetection.observer;

/**
 * OBSERVER PATTERN - Observer interface
 */
public interface IncidentObserver {
    void onIncidentEvent(IncidentEvent event);
}
