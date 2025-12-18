package com.urbanmonitor.domain.citizen.incidentdetection.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double lat;
    private Double lng;

    @Enumerated(EnumType.STRING)
    private IncidentLevel level;

    @Enumerated(EnumType.STRING)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    private ValidationStatus validationStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isHighPriority;

    public enum ValidationStatus {
        VALIDATED, PENDING, REJECTED
    }

    public enum IncidentLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum IncidentType {
        ACCIDENT, CONGESTION, ROADWORK, HAZARD, OTHER
    }
}
