package com.urbanmonitor.domain.company.method2.controller;

import com.urbanmonitor.domain.company.method2.model.Branch;
import com.urbanmonitor.domain.company.method2.repository.BranchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/company/method2/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    /**
     * Get all branches
     */
    @GetMapping
    public ResponseEntity<List<Branch>> getAllBranches() {
        log.info("Fetching all branches");
        List<Branch> branches = branchRepository.findAll();
        log.info("Retrieved {} branches", branches.size());
        return ResponseEntity.ok(branches);
    }

    /**
     * Get single branch by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Branch> getBranchById(@PathVariable Long id) {
        log.info("📡 Fetching branch {}", id);
        return branchRepository.findById(id)
                .map(branch -> {
                    log.info("Found branch {}: {}", id, branch.getName());
                    return ResponseEntity.ok(branch);
                })
                .orElseGet(() -> {
                    log.warn("Branch {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        log.info("Health check");
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Branch Optimization Service",
                "timestamp", System.currentTimeMillis()
        ));
    }
}