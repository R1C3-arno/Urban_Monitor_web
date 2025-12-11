package com.urbanmonitor.domain.citizen.repository;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.IncidentStatus;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.SeverityLevel;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * TrafficIncidentRepository
 * Data access layer for traffic incidents
 * 
 * Design Pattern: Repository Pattern
 * Provides abstraction over data access logic
 */
@Repository
public interface TrafficIncidentRepository extends JpaRepository<TrafficIncident, Long> {
    
    /**
     * Find all validated incidents (for map display)
     * Frontend expects only VALIDATED incidents
     */
    List<TrafficIncident> findByStatus(IncidentStatus status);
    
    /**
     * Find validated incidents - primary query for map
     */
    List<TrafficIncident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
    
    /**
     * Find incidents by severity level
     */
    List<TrafficIncident> findByLevel(SeverityLevel level);
    
    /**
     * Find incidents by type
     */
    List<TrafficIncident> findByType(IncidentType type);
    
    /**
     * Find high priority incidents
     */
    @Query("SELECT i FROM TrafficIncident i WHERE i.level = 'HIGH' AND i.status = 'VALIDATED'")
    List<TrafficIncident> findHighPriorityIncidents();
    
    /**
     * Find incidents within bounding box (for map viewport)
     * @param minLat Minimum latitude
     * @param maxLat Maximum latitude
     * @param minLng Minimum longitude
     * @param maxLng Maximum longitude
     */
    @Query("SELECT i FROM TrafficIncident i WHERE " +
           "i.lat BETWEEN :minLat AND :maxLat AND " +
           "i.lng BETWEEN :minLng AND :maxLng AND " +
           "i.status = 'VALIDATED'")
    List<TrafficIncident> findInBoundingBox(
        @Param("minLat") Double minLat,
        @Param("maxLat") Double maxLat,
        @Param("minLng") Double minLng,
        @Param("maxLng") Double maxLng
    );
    
    /**
     * Find incidents near a location (simplified distance check)
     * @param lat Center latitude
     * @param lng Center longitude
     * @param radius Radius in degrees (approximate)
     */
    @Query("SELECT i FROM TrafficIncident i WHERE " +
           "i.status = 'VALIDATED' AND " +
           "SQRT(POWER((i.lat - :lat), 2) + POWER((i.lng - :lng), 2)) < :radius")
    List<TrafficIncident> findNearLocation(
        @Param("lat") Double lat,
        @Param("lng") Double lng,
        @Param("radius") Double radius
    );
    
    /**
     * Find recent incidents (last N hours)
     */
    @Query("SELECT i FROM TrafficIncident i WHERE " +
           "i.createdAt >= :since AND i.status = 'VALIDATED' " +
           "ORDER BY i.createdAt DESC")
    List<TrafficIncident> findRecentIncidents(@Param("since") LocalDateTime since);
    
    /**
     * Find unresolved high priority incidents
     */
    @Query("SELECT i FROM TrafficIncident i WHERE " +
           "i.level = 'HIGH' AND " +
           "i.status IN ('PENDING', 'VALIDATED') " +
           "ORDER BY i.createdAt DESC")
    List<TrafficIncident> findUnresolvedHighPriority();
    
    /**
     * Count incidents by status
     */
    long countByStatus(IncidentStatus status);
    
    /**
     * Count incidents by level
     */
    long countByLevel(SeverityLevel level);
}
