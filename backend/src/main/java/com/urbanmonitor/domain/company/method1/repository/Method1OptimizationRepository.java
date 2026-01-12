package com.urbanmonitor.domain.company.method1.repository;

import com.urbanmonitor.domain.company.method1.model.entity.Method1Optimization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface Method1OptimizationRepository extends JpaRepository<Method1Optimization, Long> {

    List<Method1Optimization> findByBranchId(Long branchId);

    Optional<Method1Optimization> findFirstByBranchIdOrderByCreatedAtDesc(Long branchId);
}