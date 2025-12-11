package com.urbanmonitor.domain.company.method2.repository;

import com.urbanmonitor.domain.company.method2.model.Branch;
import com.urbanmonitor.domain.company.method2.model.BranchOptimization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



/**
 * Repository: Branch Optimization results (PostgreSQL)
 */
@Repository
public interface OptimizationRepository extends JpaRepository<BranchOptimization, Long> {

    /**
     * Find all optimizations for a branch, ordered by creation
     */
    List<BranchOptimization> findByBranchOrderByCreatedAtDesc(Branch branch);

    /**
     * Find latest optimization for a branch
     */
    Optional<BranchOptimization> findFirstByBranchOrderByCreatedAtDesc(Branch branch);

    /**
     * Find optimizations by strategy
     */
    List<BranchOptimization> findByStrategyAndStatus(String strategy, String status);

    /**
     * Find recent optimizations (last N hours)
     */
    @Query("""
        SELECT o FROM BranchOptimization o 
        WHERE o.createdAt >= :since
        ORDER BY o.createdAt DESC
        """)
    List<BranchOptimization> findRecentOptimizations(@Param("since") LocalDateTime since);

    /**
     * Find high-saving optimizations
     */
    @Query("""
        SELECT o FROM BranchOptimization o 
        WHERE o.costSavings >= :minSavings
        ORDER BY o.costSavings DESC
        """)
    List<BranchOptimization> findHighSavingOptimizations(@Param("minSavings") Double minSavings);
}