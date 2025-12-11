package com.urbanmonitor.domain.company.method2.algorithm.impl;


import com.urbanmonitor.domain.company.method2.algorithm.OptimizationStrategy;
import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.dto.AlgorithmStepDTO;
import com.urbanmonitor.domain.company.method2.model.Branch;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;


@Slf4j
public class HybridStrategy implements OptimizationStrategy {

    private final OptimizationStrategy algIR;
    private final OptimizationStrategy supplyChain;
    private List<AlgorithmStepDTO> steps = new ArrayList<>();

    public HybridStrategy(OptimizationStrategy algIR, OptimizationStrategy supplyChain) {
        this.algIR = algIR;
        this.supplyChain = supplyChain;
    }

    @Override
    public String getName() {
        return "Hybrid";
    }

    @Override
    public List<AlgorithmStepDTO> getSteps() {
        return steps;
    }

    @Override
    public OptimizationResultDTO optimize(Branch branch, OptimizationRequestDTO request) {
        OptimizationResultDTO algIRResult = algIR.optimize(branch, request);
        OptimizationResultDTO scResult = supplyChain.optimize(branch, request);

        return OptimizationResultDTO.builder()
                .optimalQ(Math.min(algIRResult.getOptimalQ(), scResult.getOptimalQ()))
                .reorderPoint((algIRResult.getReorderPoint() + scResult.getReorderPoint()) / 2)
                .safetyStock(Math.max(algIRResult.getSafetyStock(), scResult.getSafetyStock()))
                .forecastedLeadTime(scResult.getForecastedLeadTime())
                .transportCost(scResult.getTransportCost())
                .costSavings(algIRResult.getCostSavings() + scResult.getCostSavings())
                .optimalShipments(scResult.getOptimalShipments())
                .setupTimeReduction(scResult.getSetupTimeReduction())
                .recommendedDates(mergeDates(algIRResult.getRecommendedDates(), scResult.getRecommendedDates()))
                .computationTimeMs(algIRResult.getComputationTimeMs() + scResult.getComputationTimeMs())
                .status("OPTIMAL")
                .strategy("hybrid")
                .build();
    }

    private List<String> mergeDates(List<String> dates1, List<String> dates2) {
        Set<String> merged = new LinkedHashSet<>(dates1);
        merged.addAll(dates2);
        return new ArrayList<>(merged);
    }
}