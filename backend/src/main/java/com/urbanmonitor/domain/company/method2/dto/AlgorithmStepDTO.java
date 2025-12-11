package com.urbanmonitor.domain.company.method2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO: Algorithm step for logging
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlgorithmStepDTO {
    private Integer period;
    private Double price;
    private Double inventory;
    private Double retrieval;
    private Double demand;
    private Double revenue;
}