package com.urbanmonitor.domain.citizen.emergency.observer;

/**
 * OBSERVER PATTERN - Observer interface
 */
public interface EmergencyLocationObserver {
    void onEmergencyLocationEvent(EmergencyLocationEvent event);
}
