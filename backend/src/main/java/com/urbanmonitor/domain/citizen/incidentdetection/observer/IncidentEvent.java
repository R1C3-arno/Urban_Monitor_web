package com.urbanmonitor.domain.citizen.incidentdetection.observer;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import lombok.Getter;

/**
 * OBSERVER PATTERN
 */
@Getter
public class IncidentEvent {

    public enum EventType {
        CREATED, UPDATED, VALIDATED, REJECTED, DELETED
    }

    private final EventType type;
    private final TrafficIncident incident;

    private IncidentEvent(EventType type, TrafficIncident incident) {
        this.type = type;
        this.incident = incident;
    }

    public static IncidentEvent created(TrafficIncident incident) {
        return new IncidentEvent(EventType.CREATED, incident);
    }

    public static IncidentEvent updated(TrafficIncident incident) {
        return new IncidentEvent(EventType.UPDATED, incident);
    }

    public static IncidentEvent validated(TrafficIncident incident) {
        return new IncidentEvent(EventType.VALIDATED, incident);
    }

    public static IncidentEvent rejected(TrafficIncident incident) {
        return new IncidentEvent(EventType.REJECTED, incident);
    }

    public static IncidentEvent deleted(Long id) {
        TrafficIncident placeholder = TrafficIncident.builder().id(id).build();
        return new IncidentEvent(EventType.DELETED, placeholder);
    }
}
