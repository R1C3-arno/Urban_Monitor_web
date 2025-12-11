package com.urbanmonitor.domain.company.method2.algorithm;

import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.dto.AlgorithmStepDTO;
import com.urbanmonitor.domain.company.method2.model.Branch;

import java.util.List;

/**
 * Strategy Pattern: Base interface for optimization algorithms
 * Follows Open/Closed Principle (SOLID)
 */
public interface OptimizationStrategy {

    /**
     * Get strategy name
     */
    String getName();

    /**
     * Run optimization
     */
    OptimizationResultDTO optimize(Branch branch, OptimizationRequestDTO request);

    /**
     * Get detailed steps (for logging/analysis)
     */
    List<AlgorithmStepDTO> getSteps();
}