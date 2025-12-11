package com.urbanmonitor.domain.citizen.repository;

import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TRAFFIC EDGE REPOSITORY
 * DSA: Graph edge storage
 */
@Repository
public interface TrafficEdgeRepository extends JpaRepository<TrafficEdge, Long> {

    /**
     * Find outgoing edges from a node
     * DSA: Adjacency list query
     */
    @Query("SELECT e FROM TrafficEdge e WHERE e.fromNode.id = :nodeId")
    List<TrafficEdge> findOutgoingEdges(@Param("nodeId") Long nodeId);

    /**
     * Find incoming edges to a node
     */
    @Query("SELECT e FROM TrafficEdge e WHERE e.toNode.id = :nodeId")
    List<TrafficEdge> findIncomingEdges(@Param("nodeId") Long nodeId);

    /**
     * Find edge between two nodes
     */
    @Query("SELECT e FROM TrafficEdge e WHERE " +
           "e.fromNode.id = :fromId AND e.toNode.id = :toId")
    TrafficEdge findEdgeBetween(
            @Param("fromId") Long fromId,
            @Param("toId") Long toId
    );

    /**
     * Find highly congested edges
     * DSA: Filtering by weight/congestion
     */
    @Query("SELECT e FROM TrafficEdge e WHERE " +
           "e.congestionFactor > :threshold " +
           "ORDER BY e.congestionFactor DESC")
    List<TrafficEdge> findCongestedEdges(@Param("threshold") Double threshold);

    /**
     * Get average congestion
     */
    @Query("SELECT AVG(e.congestionFactor) FROM TrafficEdge e")
    Double getAverageCongestion();
}
