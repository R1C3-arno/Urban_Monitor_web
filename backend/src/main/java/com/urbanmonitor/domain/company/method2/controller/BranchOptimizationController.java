package com.urbanmonitor.domain.company.method2.controller;

import com.urbanmonitor.domain.company.method2.dto.BranchDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationRequestDTO;
import com.urbanmonitor.domain.company.method2.dto.OptimizationResultDTO;
import com.urbanmonitor.domain.company.method2.service.BranchOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * REST API Controller: Branch Optimization Endpoints
 * Base path: /api/company/method2/branches
 */
@Slf4j
@RestController
@RequestMapping("/api/company/method2/branches")
//@CrossOrigin(origins = "*")
public class BranchOptimizationController {

    @Autowired
    private BranchOptimizationService optimizationService;

    /**
     * POST /api/company/method2/branches/{id}/optimize
     * Run optimization on branch
     *
     * Request body:
     * {
     *   "strategy": "alg-ir" | "supply-chain" | "hybrid",
     *   "prices": {
     *     "priceMin": 30,
     *     "priceMax": 40,
     *     "periods": 10,
     *     "prices": [32, 35, 38, ...]
     *   },
     *   "parameters": {}
     * }
     */
    @PostMapping("/{id}/optimize")
    public ResponseEntity<OptimizationResultDTO> optimizeBranch(
            @PathVariable Long id,
            @RequestBody OptimizationRequestDTO request) {

        log.info("Optimizing branch {} with strategy: {}", id, request.getStrategy());

        try {
            OptimizationResultDTO result = optimizationService.optimize(
                    id,
                    request.getStrategy(),
                    request
            );

            log.info("Optimization completed: {}, cost savings: {}",
                    request.getStrategy(), result.getCostSavings());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Optimization failed for branch {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Optimization failed: " + e.getMessage());
        }
    }

    /**
     * POST /api/company/method2/branches/{id}/optimize/alg-ir
     * Run ALG-IR optimization
     */
    @PostMapping("/{id}/optimize/alg-ir")
    public ResponseEntity<OptimizationResultDTO> optimizeWithALGIR(
            @PathVariable Long id,
            @RequestBody OptimizationRequestDTO request) {

        log.info("Running ALG-IR optimization for branch: {}", id);
        OptimizationResultDTO result = optimizationService.optimizeWithALGIR(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/company/method2/branches/{id}/optimize/supply-chain
     * Run Supply Chain optimization
     */
    @PostMapping("/{id}/optimize/supply-chain")
    public ResponseEntity<OptimizationResultDTO> optimizeWithSupplyChain(
            @PathVariable Long id,
            @RequestBody OptimizationRequestDTO request) {

        log.info("Running Supply Chain optimization for branch: {}", id);
        OptimizationResultDTO result = optimizationService.optimizeWithSupplyChain(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/company/method2/branches/{id}/optimize/hybrid
     * Run Hybrid optimization
     */
    @PostMapping("/{id}/optimize/hybrid")
    public ResponseEntity<OptimizationResultDTO> optimizeHybrid(
            @PathVariable Long id,
            @RequestBody OptimizationRequestDTO request) {

        log.info("Running Hybrid optimization for branch: {}", id);
        OptimizationResultDTO result = optimizationService.optimizeHybrid(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/company/method2/branches/{id}/history
     * Get optimization history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<OptimizationResultDTO>> getOptimizationHistory(
            @PathVariable Long id) {

        log.info("Fetching optimization history for branch: {}", id);
        List<OptimizationResultDTO> history = optimizationService.getOptimizationHistory(id);
        return ResponseEntity.ok(history);
    }

    /**
     * GET /api/company/method2/branches/savings/{minSavings}
     * Get optimizations with high cost savings
     */
    @GetMapping("/savings/{minSavings}")
    public ResponseEntity<List<OptimizationResultDTO>> getHighSavingOptimizations(
            @PathVariable Double minSavings) {

        log.info("Fetching optimizations with savings >= {}", minSavings);
        List<OptimizationResultDTO> results = optimizationService.getHighSavingOptimizations(minSavings);
        return ResponseEntity.ok(results);
    }
}