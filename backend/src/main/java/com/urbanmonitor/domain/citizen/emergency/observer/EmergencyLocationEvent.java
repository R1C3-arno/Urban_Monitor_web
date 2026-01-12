package com.urbanmonitor.domain.citizen.emergency.observer;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import lombok.Getter;

/**
 * OBSERVER PATTERN - Event object
 */
@Getter
public class EmergencyLocationEvent {
    
    public enum EventType {
        CREATED, UPDATED, STATUS_CHANGED, RESOLVED, DELETED
    }
    
    private final EventType type;
    private final EmergencyLocation location;
    private final EmergencyLocation.EmergencyStatus previousStatus;
    private final EmergencyLocation.EmergencyStatus newStatus;
    
    private EmergencyLocationEvent(EventType type, EmergencyLocation location,
                                   EmergencyLocation.EmergencyStatus previousStatus,
                                   EmergencyLocation.EmergencyStatus newStatus) {
        this.type = type;
        this.location = location;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
    }
    
    public static EmergencyLocationEvent created(EmergencyLocation location) {
        return new EmergencyLocationEvent(EventType.CREATED, location, null, location.getStatus());
    }
    
    public static EmergencyLocationEvent updated(EmergencyLocation location) {
        return new EmergencyLocationEvent(EventType.UPDATED, location, null, null);
    }
    
    public static EmergencyLocationEvent statusChanged(EmergencyLocation location,
                                                        EmergencyLocation.EmergencyStatus previousStatus,
                                                        EmergencyLocation.EmergencyStatus newStatus) {
        return new EmergencyLocationEvent(EventType.STATUS_CHANGED, location, previousStatus, newStatus);
    }

    //chưa phát triển
    public static EmergencyLocationEvent resolved(EmergencyLocation location) {
        return new EmergencyLocationEvent(EventType.RESOLVED, location, null, 
            EmergencyLocation.EmergencyStatus.RESOLVED);
    }
    
    public static EmergencyLocationEvent deleted(Long id) {
        EmergencyLocation placeholder = EmergencyLocation.builder().id(id).build();
        return new EmergencyLocationEvent(EventType.DELETED, placeholder, null, null);
    }
}
