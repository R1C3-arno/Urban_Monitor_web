package com.urbanmonitor.domain.citizen.repository;

import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TRAFFIC NODE REPOSITORY
 * DSA: Graph vertex storage
 */
@Repository
public interface TrafficNodeRepository extends JpaRepository<TrafficNode, Long> {

    /**
     * Find nodes with high congestion
     * DSA: Filtering operation
     */
    List<TrafficNode> findByCongestionLevelGreaterThan(Integer threshold);

    /**
     * Find available (not blocked) nodes
     */
    List<TrafficNode> findByIsBlocked(Boolean isBlocked);

    /**
     * Find nearest node to coordinates
     * DSA: Nearest neighbor search
     */
    @Query(value = "SELECT * FROM traffic_nodes " +
            "ORDER BY calculate_distance(lat, lng, :lat, :lng) " +
            "LIMIT 1",
            nativeQuery = true)
    TrafficNode findNearestNode(@Param("lat") Double lat, @Param("lng") Double lng);

    /**
     * Find nodes within radius
     */
    @Query(value = "SELECT * FROM traffic_nodes n WHERE " +
            "calculate_distance(n.lat, n.lng, :lat, :lng) <= :radiusM",
            nativeQuery = true)
    List<TrafficNode> findNodesWithinRadius(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radiusM") Double radiusM
    );
}
