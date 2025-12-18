package com.urbanmonitor.domain.citizen.disasterMonitor.observer;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import lombok.Getter;

/**
 * OBSERVER PATTERN - Event object
 * 
 * Immutable event chứa thông tin về disaster zone change.
 */
@Getter
public class DisasterZoneEvent {
    
    public enum EventType {
        CREATED,
        UPDATED,
        STATUS_CHANGED,
        DELETED
    }
    
    private final EventType type;
    private final DisasterZone zone;
    private final DisasterZone.ZoneStatus previousStatus;
    private final DisasterZone.ZoneStatus newStatus;
    
    private DisasterZoneEvent(EventType type, DisasterZone zone, 
                              DisasterZone.ZoneStatus previousStatus, 
                              DisasterZone.ZoneStatus newStatus) {
        this.type = type;
        this.zone = zone;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
    }
    
    public static DisasterZoneEvent created(DisasterZone zone) {
        return new DisasterZoneEvent(EventType.CREATED, zone, null, zone.getStatus());
    }
    
    public static DisasterZoneEvent updated(DisasterZone zone) {
        return new DisasterZoneEvent(EventType.UPDATED, zone, null, null);
    }
    
    public static DisasterZoneEvent statusChanged(DisasterZone zone, 
                                                   DisasterZone.ZoneStatus previousStatus,
                                                   DisasterZone.ZoneStatus newStatus) {
        return new DisasterZoneEvent(EventType.STATUS_CHANGED, zone, previousStatus, newStatus);
    }
    
    public static DisasterZoneEvent deleted(Long id) {
        DisasterZone placeholder = DisasterZone.builder().id(id).build();
        return new DisasterZoneEvent(EventType.DELETED, placeholder, null, null);
    }
}
