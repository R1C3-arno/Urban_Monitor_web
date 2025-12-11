package com.urbanmonitor.domain.company.method2.service;

import com.urbanmonitor.domain.company.method2.algorithm.OptimizationStrategy;
import com.urbanmonitor.domain.company.method2.algorithm.factory.OptimizationStrategyFactory;
import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.dto.BranchDTO;
import com.urbanmonitor.domain.company.method2.model.Branch;
import com.urbanmonitor.domain.company.method2.model.BranchOptimization;
import com.urbanmonitor.domain.company.method2.repository.BranchRepository;
import com.urbanmonitor.domain.company.method2.repository.OptimizationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service: Branch Optimization Business Logic
 * Single Responsibility: Manages optimization workflows
 */
@Slf4j
@Service
@Transactional
public class BranchOptimizationService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private OptimizationRepository optimizationRepository;

    @Autowired
    private OptimizationStrategyFactory strategyFactory;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Optimize branch with ALG-IR
     */
    public OptimizationResultDTO optimizeWithALGIR(Long branchId, OptimizationRequestDTO request) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        log.info("Optimizing branch {} with ALG-IR", branch.getName());

        OptimizationStrategy strategy = strategyFactory.createALGIRStrategy(
                1000, 30, 40, 100, 1.0, 0.2
        );

        OptimizationResultDTO result = strategy.optimize(branch, request);

        // Save to database
        saveBranchOptimization(branch, result, strategy.getName());

        return result;
    }

    /**
     * Optimize branch with Supply Chain algorithm
     */
    public OptimizationResultDTO optimizeWithSupplyChain(Long branchId, OptimizationRequestDTO request) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        log.info("Optimizing branch {} with Supply Chain", branch.getName());

        OptimizationStrategy strategy = strategyFactory.createSupplyChainStrategy(
                branch.getDemand(), 5.0, 150.0, branch.getDistance()
        );

        OptimizationResultDTO result = strategy.optimize(branch, request);

        // Save to database
        saveBranchOptimization(branch, result, strategy.getName());

        return result;
    }

    /**
     * Optimize branch with Hybrid strategy (recommended)
     */
    public OptimizationResultDTO optimizeHybrid(Long branchId, OptimizationRequestDTO request) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        log.info("Optimizing branch {} with Hybrid strategy", branch.getName());

        OptimizationStrategy strategy = strategyFactory.createHybridStrategy(branch);
        OptimizationResultDTO result = strategy.optimize(branch, request);

        // Save to database
        saveBranchOptimization(branch, result, strategy.getName());

        return result;
    }

    /**
     * Run optimization by strategy name
     */
    public OptimizationResultDTO optimize(Long branchId, String strategyName, OptimizationRequestDTO request) {
        switch (strategyName.toLowerCase()) {
            case "alg-ir":
                return optimizeWithALGIR(branchId, request);
            case "supply-chain":
                return optimizeWithSupplyChain(branchId, request);
            case "hybrid":
            default:
                return optimizeHybrid(branchId, request);
        }
    }

    /**
     * Get branch with latest optimization
     */
    @Cacheable(value = "branchOptimization", key = "#branchId")
    public BranchDTO getBranchWithOptimization(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        BranchOptimization latestOpt = optimizationRepository.findFirstByBranchOrderByCreatedAtDesc(branch)
                .orElse(null);

        OptimizationResultDTO optResult = latestOpt != null ?
                OptimizationResultDTO.builder()
                        .optimalQ(latestOpt.getOptimalQ())
                        .reorderPoint(latestOpt.getReorderPoint())
                        .safetyStock(latestOpt.getSafetyStock())
                        .forecastedLeadTime(latestOpt.getForecastedLeadTime())
                        .transportCost(latestOpt.getTransportCost())
                        .costSavings(latestOpt.getCostSavings())
                        .optimalShipments(latestOpt.getOptimalShipments())
                        .setupTimeReduction(latestOpt.getSetupTimeReduction())
                        .computationTimeMs(latestOpt.getComputationTimeMs())
                        .status(latestOpt.getStatus())
                        .strategy(latestOpt.getStrategy())
                        .build()
                : null;

        return BranchDTO.builder()
                .id(branch.getId())
                .code(branch.getCode())
                .name(branch.getName())
                .latitude(branch.getLatitude())
                .longitude(branch.getLongitude())
                .currentStock(branch.getCurrentStock())
                .demand(branch.getDemand())
                .leadTime(branch.getLeadTime())
                .distance(branch.getDistance())
                .city(branch.getCity())
                .address(branch.getAddress())
                .optimization(optResult)
                .build();
    }

    /**
     * Get all branches with latest optimization
     */
    public List<BranchDTO> getAllBranchesWithOptimization() {
        return branchRepository.findByIsActiveTrue().stream()
                .map(this::convertToBranchDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get branches needing optimization
     */
    public List<BranchDTO> getBranchesNeedingOptimization() {
        return branchRepository.findBranchesNeedingOptimization().stream()
                .map(this::convertToBranchDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get optimization history for branch
     */
    public List<OptimizationResultDTO> getOptimizationHistory(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branchId));

        return optimizationRepository.findByBranchOrderByCreatedAtDesc(branch).stream()
                .map(this::convertToResultDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get high-value optimization results
     */
    public List<OptimizationResultDTO> getHighSavingOptimizations(Double minSavings) {
        return optimizationRepository.findHighSavingOptimizations(minSavings).stream()
                .map(this::convertToResultDTO)
                .collect(Collectors.toList());
    }

    // ===== Helper Methods =====

    private void saveBranchOptimization(Branch branch, OptimizationResultDTO result, String strategyName) {
        try {
            BranchOptimization optimization = BranchOptimization.builder()
                    .branch(branch)
                    .strategy(strategyName)
                    .status(result.getStatus())
                    .optimalQ(result.getOptimalQ())
                    .reorderPoint(result.getReorderPoint())
                    .safetyStock(result.getSafetyStock())
                    .forecastedLeadTime(result.getForecastedLeadTime())
                    .transportCost(result.getTransportCost())
                    .costSavings(result.getCostSavings())
                    .optimalShipments(result.getOptimalShipments())
                    .setupTimeReduction(result.getSetupTimeReduction())
                    .computationTimeMs(result.getComputationTimeMs())
                    .recommendedDates(objectMapper.valueToTree(result.getRecommendedDates()))
                    .build();

            optimizationRepository.save(optimization);
            log.info("Saved optimization for branch {}: {}", branch.getName(), strategyName);
        } catch (Exception e) {
            log.error("Error saving optimization: {}", e.getMessage(), e);
        }
    }

    private BranchDTO convertToBranchDTO(Branch branch) {
        BranchOptimization latestOpt = optimizationRepository.findFirstByBranchOrderByCreatedAtDesc(branch)
                .orElse(null);

        OptimizationResultDTO optResult = latestOpt != null ? convertToResultDTO(latestOpt) : null;

        return BranchDTO.builder()
                .id(branch.getId())
                .code(branch.getCode())
                .name(branch.getName())
                .latitude(branch.getLatitude())
                .longitude(branch.getLongitude())
                .currentStock(branch.getCurrentStock())
                .demand(branch.getDemand())
                .leadTime(branch.getLeadTime())
                .distance(branch.getDistance())
                .city(branch.getCity())
                .address(branch.getAddress())
                .optimization(optResult)
                .build();
    }

    private OptimizationResultDTO convertToResultDTO(BranchOptimization optimization) {
        return OptimizationResultDTO.builder()
                .optimalQ(optimization.getOptimalQ())
                .reorderPoint(optimization.getReorderPoint())
                .safetyStock(optimization.getSafetyStock())
                .forecastedLeadTime(optimization.getForecastedLeadTime())
                .transportCost(optimization.getTransportCost())
                .costSavings(optimization.getCostSavings())
                .optimalShipments(optimization.getOptimalShipments())
                .setupTimeReduction(optimization.getSetupTimeReduction())
                .computationTimeMs(optimization.getComputationTimeMs())
                .status(optimization.getStatus())
                .strategy(optimization.getStrategy())
                .build();
    }
}