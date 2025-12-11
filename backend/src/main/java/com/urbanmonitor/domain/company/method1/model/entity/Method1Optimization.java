package com.urbanmonitor.domain.company.method1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Method1 Optimization Result Entity
 * Stores supply chain optimization results in database
 */
@Entity
@Table(name = "method1_optimizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Method1Optimization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "branch_id", nullable = false)
    private Long branchId;

    @Column(name = "n")
    private Integer n;

    @Column(name = "q")
    private Double q;

    @Column(name = "p")
    private Double p;

    @Column(name = "k1")
    private Double k1;

    @Column(name = "av")
    private Double av;

    @Column(name = "theta")
    private Double theta;

    @Column(name = "ts")
    private Double ts;

    @Column(name = "tc")
    private Double tc;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}