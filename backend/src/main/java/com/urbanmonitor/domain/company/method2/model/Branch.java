package com.urbanmonitor.domain.company.method2.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Branch Entity - Represents physical store location
 * Mapped to PostgreSQL table: branches_method2
 */
@Entity
@Table(name = "branches_method2", schema = "company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "optimizations")
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer currentStock;

    @Column(nullable = false)
    private Double demand;

    @Column(nullable = false)
    private Double leadTime;

    @Column(name = "manager", nullable = true)
    private String manager;

    @Column(name = "employee_count", nullable = true)
    private Integer employeeCount;

    @Column(name = "monthly_revenue", nullable = true)
    private Double monthlyRevenue;

    @Column(name = "monthly_expense", nullable = true)
    private Double monthlyExpense;

    @Column(name = "monthly_profit", nullable = true)
    private Double monthlyProfit;


    @Column(nullable = false)
    private Double distance;      // Distance to warehouse (km)

    @Column(nullable = false)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<BranchOptimization> optimizations = new ArrayList<>();

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
     * Get latest optimization result
     */
    public BranchOptimization getLatestOptimization() {
        if (optimizations.isEmpty()) return null;
        return optimizations.stream()
                .max((o1, o2) -> o1.getCreatedAt().compareTo(o2.getCreatedAt()))
                .orElse(null);
    }



}