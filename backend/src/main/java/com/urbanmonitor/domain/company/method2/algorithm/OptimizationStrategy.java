package com.urbanmonitor.domain.company.method2.algorithm;

import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.dto.AlgorithmStepDTO;
import com.urbanmonitor.domain.company.method2.model.Branch;

import java.util.List;

/**
 * Strategy Pattern
 */
public interface OptimizationStrategy {

    String getName();

    //Run
    OptimizationResultDTO optimize(Branch branch, OptimizationRequestDTO request);

    List<AlgorithmStepDTO> getSteps();
}