package com.urbanmonitor.domain.company.method1.repository;

import com.urbanmonitor.domain.company.method1.model.entity.Method1Optimization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Method1Optimization Entity
 */
@Repository
public interface Method1OptimizationRepository extends JpaRepository<Method1Optimization, Long> {

    /**
     * Find all optimizations by branch ID
     */
    List<Method1Optimization> findByBranchId(Long branchId);

    /**
     * Find latest optimization for a branch
     */
    Optional<Method1Optimization> findFirstByBranchIdOrderByCreatedAtDesc(Long branchId);
}