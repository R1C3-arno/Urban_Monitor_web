package com.urbanmonitor.domain.company.method2.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

/**
 * BranchOptimization Entity - Stores optimization results
 * Mapped to PostgreSQL table: branch_optimizations_method2
 */
@Entity
@Table(name = "branch_optimizations_method2", schema = "company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "branch")
public class BranchOptimization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(nullable = false, length = 50)
    private String strategy;  // "alg-ir", "supply-chain", "hybrid"

    @Column(nullable = false, length = 50)
    private String status;    // "OPTIMAL", "FEASIBLE", "PENDING"

    // ===== ALG-IR RESULTS =====
    @Column(name = "optimal_q")
    private Double optimalQ;

    @Column(name = "reorder_point")
    private Double reorderPoint;

    @Column(name = "safety_stock")
    private Double safetyStock;

    @Column(name = "forecasted_lead_time")
    private Double forecastedLeadTime;

    // ===== SUPPLY CHAIN RESULTS =====
    @Column(name = "transport_cost")
    private Double transportCost;

    @Column(name = "cost_savings")
    private Double costSavings;

    @Column(name = "optimal_shipments")
    private Integer optimalShipments;

    @Column(name = "setup_time_reduction")
    private Double setupTimeReduction;

    // ===== META DATA =====
    @Column(name = "computation_time_ms")
    private Long computationTimeMs;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode recommendedDates;  // PostgreSQL JSONB

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode algorithmSteps;    // Detailed step logs

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
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
}