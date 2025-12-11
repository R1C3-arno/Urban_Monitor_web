package com.urbanmonitor.domain.company.method2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptimizationResultDTO {
    // ALG-IR Results
    private Double optimalQ;
    private Double reorderPoint;
    private Double safetyStock;
    private Double forecastedLeadTime;

    // Supply Chain Results
    private Double transportCost;
    private Double costSavings;
    private Integer optimalShipments;
    private Double setupTimeReduction;

    // Meta
    private Long computationTimeMs;
    private List<String> recommendedDates;
    private String status;              // "OPTIMAL", "FEASIBLE", "PENDING"
    private String strategy;            // "alg-ir", "supply-chain", "hybrid"
}