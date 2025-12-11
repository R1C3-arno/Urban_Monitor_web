package com.urbanmonitor.domain.citizen.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * TRAFFIC NODE ENTITY
 * Represents a vertex in the traffic graph
 * 
 * DSA: Graph Theory - Node/Vertex
 * 
 * OOP Principles:
 * - Encapsulation
 * - Data integrity through validation
 */
@Entity
@Table(name = "traffic_nodes", indexes = {
    @Index(name = "idx_traffic_nodes_location", columnList = "lat, lng")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "node_name", nullable = false)
    private String nodeName;

    @Column(name = "location_name", columnDefinition = "TEXT")
    private String locationName;

    // Location
    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    @Column(nullable = false)
    private Double lat;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    @Column(nullable = false)
    private Double lng;

    // Traffic Status
    @Min(0)
    @Max(100)
    @Column(name = "congestion_level")
    private Integer congestionLevel = 0;

    @Column(name = "is_blocked")
    private Boolean isBlocked = false;

    // Metadata
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Business Logic: Check if node is available for routing
     * DSA: Graph traversal precondition
     */
    public boolean isAvailable() {
        return !Boolean.TRUE.equals(isBlocked) && congestionLevel < 90;
    }

    /**
     * Get congestion factor for Dijkstra weight calculation
     */
    public double getCongestionFactor() {
        if (congestionLevel == null) return 1.0;
        return 1.0 + (congestionLevel / 100.0);
    }
}
