package com.urbanmonitor.domain.citizen.incidentdetection.repository;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<TrafficIncident, Long> {

    @Query("""
        SELECT i FROM TrafficIncident i
        WHERE i.validationStatus = :status
        AND i.lat IS NOT NULL
        AND i.lng IS NOT NULL
        ORDER BY i.createdAt DESC
    """)
    List<TrafficIncident> findValidated(
            @Param("status") TrafficIncident.ValidationStatus status
    );
}