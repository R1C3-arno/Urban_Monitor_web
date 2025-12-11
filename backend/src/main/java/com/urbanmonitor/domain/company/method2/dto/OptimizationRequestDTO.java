package com.urbanmonitor.domain.company.method2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptimizationRequestDTO {
    private String strategy;            // "alg-ir", "supply-chain", "hybrid"
    private PriceSequenceDTO prices;
    private Map<String, Object> parameters;  // Optional parameters
}
