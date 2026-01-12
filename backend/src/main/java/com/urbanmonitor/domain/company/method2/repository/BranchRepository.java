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
 * Repository: Branch data access (PostgreSQL)
 */
@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    Optional<Branch> findByCode(String code);

    List<Branch> findByIsActiveTrueAndCity(String city);

    List<Branch> findByIsActiveTrue();

    /**
     * Custom query: Find branches needing optimization
     * (stock < reorder point)
     */
    @Query(value = """
        SELECT b.* FROM company.branches_method2 b
        WHERE b.is_active = true
        AND b.current_stock < (b.demand * 0.5)
        ORDER BY b.current_stock ASC
        """, nativeQuery = true)
    List<Branch> findBranchesNeedingOptimization();

    /**
     * Find branches by distance range
     */
    @Query("SELECT b FROM Branch b WHERE b.distance BETWEEN :minDistance AND :maxDistance")
    List<Branch> findByDistanceRange(
            @Param("minDistance") Double minDistance,
            @Param("maxDistance") Double maxDistance
    );
}