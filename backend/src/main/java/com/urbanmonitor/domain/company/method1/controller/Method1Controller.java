package com.urbanmonitor.domain.company.method1.controller;

import com.urbanmonitor.domain.company.method1.dto.Method1OptimizationDTO;
import com.urbanmonitor.domain.company.method1.model.entity.Method1Optimization;
import com.urbanmonitor.domain.company.method1.service.Method1Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Method1 Optimization REST API Controller
 * Base path: /api/company/method1
 *
 * Endpoints:
 * - POST /optimize - Run optimization
 * - GET /branches/{branchId}/history - Get history
 * - GET /branches/{branchId}/latest - Get latest result
 * - GET /health - Health check
 */
@Slf4j
@RestController
@RequestMapping("/api/company/method1")
@CrossOrigin(origins = "*")
public class Method1Controller {

    @Autowired
    private Method1Service method1Service;

    /**
     * POST /api/company/method1/optimize
     * Run optimization with given parameters
     *
     * @param dto Optimization parameters
     * @return Optimization result with all calculated values
     */
    @PostMapping("/optimize")
    public ResponseEntity<?> optimize(@RequestBody Method1OptimizationDTO dto) {
        log.info("📡 POST /optimize - Branch: {}", dto.getBranchId());

        try {
            Method1Optimization result = method1Service.runOptimization(dto);

            if (result != null) {
                log.info("✅ Optimization success - TC: {}", result.getTc());
                return ResponseEntity.ok(result);
            } else {
                log.warn("⚠️ Optimization returned null");
                return ResponseEntity.badRequest().body(Map.of("error", "Optimization failed"));
            }
        } catch (Exception e) {
            log.error("❌ Error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/company/method1/branches/{branchId}/history
     * Get all optimization history for a branch
     *
     * @param branchId Branch identifier
     * @return List of all optimization results for the branch
     */
    @GetMapping("/branches/{branchId}/history")
    public ResponseEntity<List<Method1Optimization>> getHistory(@PathVariable Long branchId) {
        log.info("📡 GET /history - Branch: {}", branchId);
        List<Method1Optimization> history = method1Service.getHistory(branchId);
        return ResponseEntity.ok(history);
    }

    /**
     * GET /api/company/method1/branches/{branchId}/latest
     * Get latest optimization result for a branch
     *
     * @param branchId Branch identifier
     * @return Latest optimization result or 404 if not found
     */
    @GetMapping("/branches/{branchId}/latest")
    public ResponseEntity<?> getLatest(@PathVariable Long branchId) {
        log.info("📡 GET /latest - Branch: {}", branchId);

        Optional<Method1Optimization> result = method1Service.getLatest(branchId);
        return result.isPresent()
                ? ResponseEntity.ok(result.get())
                : ResponseEntity.notFound().build();
    }

    /**
     * GET /api/company/method1/health
     * Health check endpoint
     *
     * @return Service status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Method1 Optimization",
                "version", "1.0.0"
        ));
    }
}