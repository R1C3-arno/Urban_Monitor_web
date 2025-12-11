package com.urbanmonitor.domain.company.method2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO: Price simulation input
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PriceSequenceDTO {
    private Double priceMin;
    private Double priceMax;
    private Integer periods;
    private List<Double> prices;
}
