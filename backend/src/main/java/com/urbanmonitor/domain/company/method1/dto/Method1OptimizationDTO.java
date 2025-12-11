package com.urbanmonitor.domain.company.method1.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object for Method1 Optimization Request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Method1OptimizationDTO {

    // Branch info
    private Long branchId;

    // Demand & Production bounds
    private Double demand;          // D
    private Double pMin;            // Pmin
    private Double pMax;            // Pmax

    // Cost parameters
    private Double av0;             // Av0 (initial setup cost)
    private Double a0;              // A0 (ordering cost)
    private Double ct;              // CT (transport cost)
    private Double hb;              // hb (buyer holding cost)
    private Double hv;              // hv (vendor holding cost)
    private Double pi;              // π (backorder cost)

    // Production costs
    private Double xi1;             // ξ1 (production cost factor 1)
    private Double xi2;             // ξ2 (production cost factor 2)

    // Investment costs
    private Double b1;              // B1 (defective reduction investment)
    private Double b2;              // B2 (setup cost reduction investment)

    // Probabilities & time
    private Double sigma;           // σ (standard deviation)
    private Double rho;             // ρ (defective rate cost)
    private Double theta0;          // θ0 (initial defective probability)
    private Double tt;              // tT (transportation time)

    // Setup time components
    private List<Double> aList;     // [a1, a2, a3, ...] normal durations
    private List<Double> bList;     // [b1, b2, b3, ...] minimum durations
    private List<Double> cList;     // [C1, C2, C3, ...] crashing costs
}