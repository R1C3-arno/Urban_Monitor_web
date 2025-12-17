package com.urbanmonitor.domain.citizen.disasterMonitor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disaster_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisasterZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisasterType disasterType;

    private String name;

    private String description;

    private String region;

    @Enumerated(EnumType.STRING)
    private SeverityLevel severity;

    @Enumerated(EnumType.STRING)
    private ZoneStatus status;

    // Center point for map focus
    private Double centerLongitude;
    private Double centerLatitude;

    // GeoJSON polygon coordinates stored as TEXT (JSON array format)
    // Format: [[lng1,lat1],[lng2,lat2],[lng3,lat3],[lng4,lat4],[lng1,lat1]]
    @Column(columnDefinition = "TEXT")
    private String polygonCoordinates;

    // Affected area in square kilometers
    private Double affectedAreaKm2;

    // Population affected
    private Long affectedPopulation;

    // Measurement values specific to disaster type
    private Double measurementValue;
    private String measurementUnit;

    private String alertMessage;

    private String evacuationInfo;

    private String contactHotline;

    private LocalDateTime startedAt;
    
    private LocalDateTime expectedEndAt;
    
    private LocalDateTime endedAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    public enum DisasterType {
        FLOOD,
        EARTHQUAKE,
        HEATWAVE,
        STORM
    }

    public enum SeverityLevel {
        LOW,
        MODERATE,
        HIGH,
        SEVERE,
        EXTREME
    }

    public enum ZoneStatus {
        MONITORING,
        WARNING,
        ALERT,
        EMERGENCY,
        RECOVERING,
        RESOLVED
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ZoneStatus.MONITORING;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
