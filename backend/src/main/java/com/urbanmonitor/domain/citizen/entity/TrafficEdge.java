package com.urbanmonitor.domain.citizen.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * TRAFFIC EDGE ENTITY
 * Represents an edge in the traffic graph (road between intersections)
 * 
 * DSA: Graph Theory - Edge/Arc
 * Used in Dijkstra's algorithm for shortest path
 * 
 * Weight = distance * congestion_factor
 */
@Entity
@Table(name = "traffic_edges", 
    indexes = {
        @Index(name = "idx_traffic_edges_from", columnList = "from_node_id"),
        @Index(name = "idx_traffic_edges_to", columnList = "to_node_id"),
        @Index(name = "idx_traffic_edges_weight", columnList = "weight")
    },
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"from_node_id", "to_node_id"})
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Graph edge relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_node_id", nullable = false)
    private TrafficNode fromNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_node_id", nullable = false)
    private TrafficNode toNode;

    // Edge properties
    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer distance; // meters

    @NotNull
    @Min(1)
    @Column(name = "travel_time", nullable = false)
    private Integer travelTime; // seconds

    @Column(name = "road_name")
    private String roadName;

    @Column(name = "is_bidirectional")
    private Boolean isBidirectional = true;

    // Traffic conditions
    @Column(name = "current_speed")
    private Double currentSpeed = 40.0; // km/h

    @Column(name = "max_speed")
    private Double maxSpeed = 60.0; // km/h

    @Min(value = 1)
    @Column(name = "congestion_factor")
    private Double congestionFactor = 1.0;

    // Weight for Dijkstra - auto-calculated by database
    @Column(insertable = false, updatable = false)
    private Integer weight;

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
     * DSA: Calculate edge weight for Dijkstra's algorithm
     * Weight = distance * congestion_factor
     * 
     * Higher congestion = higher weight = avoid this road
     */
    public int calculateWeight() {
        return (int) (distance * congestionFactor);
    }

    /**
     * Business Logic: Check if edge is usable
     */
    public boolean isUsable() {
        return fromNode != null && toNode != null && 
               fromNode.isAvailable() && toNode.isAvailable();
    }

    /**
     * Update congestion based on current traffic
     */
    public void updateCongestion(double newFactor) {
        this.congestionFactor = Math.max(1.0, Math.min(3.0, newFactor));
    }
}
