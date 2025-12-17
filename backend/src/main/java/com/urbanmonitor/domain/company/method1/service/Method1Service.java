package com.urbanmonitor.domain.company.method1.service;

import com.urbanmonitor.domain.company.method1.algorithm.Method1Optimizer;
import com.urbanmonitor.domain.company.method1.dto.Method1OptimizationDTO;
import com.urbanmonitor.domain.company.method1.model.entity.Method1Optimization;
import com.urbanmonitor.domain.company.method1.repository.Method1OptimizationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Method1 Optimization Service
 * Handles business logic: run optimization, save results, retrieve history
 */
@Slf4j
@Service
public class Method1Service {

    @Autowired
    private Method1OptimizationRepository repository;

    /**
     * Run optimization and save result to database
     */
    public Method1Optimization runOptimization(Method1OptimizationDTO dto) {
        log.info("Method1 Optimization - Branch: {}", dto.getBranchId());

        try {
            // Run algorithm
            Method1Optimizer.OptimizationResult result = Method1Optimizer.optimize(dto);

            if (result == null) {
                log.error("Optimization failed");
                return null;
            }

            // Save to database
            Method1Optimization optimization = Method1Optimization.builder()
                    .branchId(dto.getBranchId())
                    .n(result.getN())
                    .q(result.getQ())
                    .p(result.getP())
                    .k1(result.getK1())
                    .av(result.getAv())
                    .theta(result.getTheta())
                    .ts(result.getTs())
                    .tc(result.getTc())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Method1Optimization saved = repository.save(optimization);
            log.info("Optimization saved - ID: {}, TC: {}", saved.getId(), saved.getTc());

            return saved;

        } catch (Exception e) {
            log.error("Error during optimization: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Get all optimization history for a branch
     */
    public List<Method1Optimization> getHistory(Long branchId) {
        log.info("Getting history for branch: {}", branchId);
        return repository.findByBranchId(branchId);
    }

    /**
     * Get latest optimization result for a branch
     */
    public Optional<Method1Optimization> getLatest(Long branchId) {
        log.info("Getting latest optimization for branch: {}", branchId);
        return repository.findFirstByBranchIdOrderByCreatedAtDesc(branchId);
    }
}