package com.urbanmonitor.domain.citizen.emergency.observer;

/**
 * OBSERVER PATTERN
 */
public interface EmergencyLocationObserver {
    void onEmergencyLocationEvent(EmergencyLocationEvent event);
}
