package com.urbanmonitor.domain.citizen.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * TrafficIncident Entity
 * Represents validated traffic incidents displayed on the map
 * 
 * Design Patterns:
 * - Builder Pattern (via @Builder)
 * - Entity Pattern (JPA)
 * 
 * OOP Principles:
 * - Encapsulation (private fields with getters/setters)
 * - Data validation via Bean Validation
 */
@Entity
@Table(name = "traffic_incidents", indexes = {
    @Index(name = "idx_traffic_incidents_location", columnList = "lat, lng"),
    @Index(name = "idx_traffic_incidents_level", columnList = "level"),
    @Index(name = "idx_traffic_incidents_status", columnList = "status"),
    @Index(name = "idx_traffic_incidents_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficIncident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Incident type: CAR, BIKE, ACCIDENT, JAM, SLOW, FAST
     * Determines which icon to display on frontend
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentType type;
    
    /**
     * Severity level: LOW, MEDIUM, HIGH
     * Determines color coding and zone radius
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SeverityLevel level;
    
    /**
     * Latitude (-90 to 90)
     */
    @NotNull
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    @Column(nullable = false)
    private Double lat;
    
    /**
     * Longitude (-180 to 180)
     */
    @NotNull
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    @Column(nullable = false)
    private Double lng;
    
    /**
     * Image data (can be URL or base64 encoded string)
     */
    @Column(columnDefinition = "TEXT")
    private String image;
    
    /**
     * Incident status
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.PENDING;
    
    /**
     * Reporter name/identifier
     */
    @Column(length = 255)
    @Builder.Default
    private String reporter = "Anonymous";
    
    /**
     * Reference to affected traffic node (optional)
     */
    @Column(name = "affected_node_id")
    private Long affectedNodeId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    // ==================== BUSINESS LOGIC ====================
    
    /**
     * Check if incident is high priority
     */
    public boolean isHighPriority() {
        return this.level == SeverityLevel.HIGH;
    }
    
    /**
     * Check if incident is validated
     */
    public boolean isValidated() {
        return this.status == IncidentStatus.VALIDATED;
    }
    
    /**
     * Check if incident has image
     */
    public boolean hasImage() {
        return this.image != null && !this.image.isEmpty();
    }
    
    /**
     * Mark incident as resolved
     */
    public void resolve() {
        this.status = IncidentStatus.RESOLVED;
        this.resolvedAt = LocalDateTime.now();
    }
    
    /**
     * Mark incident as validated
     */
    public void validate() {
        this.status = IncidentStatus.VALIDATED;
    }
    
    // ==================== ENUMS ====================
    
    /**
     * Incident Type - matches frontend expectations
     */
    public enum IncidentType {
        CAR,        // Car-related incident
        BIKE,       // Bike-related incident  
        ACCIDENT,   // Accident/crash
        JAM,        // Traffic jam
        SLOW,       // Slow moving traffic
        FAST        // Fast moving traffic (good)
    }
    
    /**
     * Severity Level - matches frontend expectations
     */
    public enum SeverityLevel {
        LOW,        // Minor issue
        MEDIUM,     // Moderate issue
        HIGH        // Severe issue
    }
    
    /**
     * Incident Status
     */
    public enum IncidentStatus {
        PENDING,    // Awaiting validation
        VALIDATED,  // Approved and displayed on map
        REJECTED,   // Rejected by moderator
        RESOLVED,   // Issue has been resolved
        ACTIVE      // Legacy status (same as VALIDATED)
    }
}
