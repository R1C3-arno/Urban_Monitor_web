package com.urbanmonitor.domain.company.method2.dto;

import lombok.*;
import java.util.*;

/**
 * DTO: Branch data with optimization results
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BranchDTO {
    private Long id;
    private String code;
    private String name;
    private Double latitude;
    private Double longitude;
    private Integer currentStock;
    private Double demand;
    private Double leadTime;
    private Double distance;
    private String city;
    private String address;

    // Optimization result
    private OptimizationResultDTO optimization;
}

