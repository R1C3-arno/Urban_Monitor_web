package com.urbanmonitor.domain.citizen.disasterMonitor.observer;

/**
 * OBSERVER PATTERN - Observer interface
 * Interface cho các components muốn nhận notification về disaster zone changes.
 */
public interface DisasterZoneObserver {
    
    /**
     * Called when a disaster zone event occurs
     */
    void onDisasterZoneEvent(DisasterZoneEvent event);
}
