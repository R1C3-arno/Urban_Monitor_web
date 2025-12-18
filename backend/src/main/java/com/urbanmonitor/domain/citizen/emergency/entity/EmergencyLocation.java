package com.urbanmonitor.domain.citizen.emergency.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyType emergencyType;

    private String name;
    private String description;
    private String address;
    private Double longitude;
    private Double latitude;

    @Enumerated(EnumType.STRING)
    private EmergencyStatus status;

    @Enumerated(EnumType.STRING)
    private PriorityLevel priority;

    private String contactPhone;
    private String imageUrl;

    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum EmergencyType {
        AMBULANCE, FIRE, CRIME, FAMILY
    }

    public enum EmergencyStatus {
        ACTIVE, RESPONDING, RESOLVED, CANCELLED
    }

    public enum PriorityLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reportedAt == null) this.reportedAt = LocalDateTime.now();
        if (this.status == null) this.status = EmergencyStatus.ACTIVE;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
