package com.urbanmonitor.domain.citizen.disasterMonitor.repository;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.ZoneStatus;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterZoneRepository extends JpaRepository<DisasterZone, Long> {

    List<DisasterZone> findByDisasterType(DisasterType type);

    List<DisasterZone> findByStatus(ZoneStatus status);

    List<DisasterZone> findBySeverity(SeverityLevel severity);

    List<DisasterZone> findByDisasterTypeAndStatus(DisasterType type, ZoneStatus status);

    List<DisasterZone> findByDisasterTypeAndSeverity(DisasterType type, SeverityLevel severity);

    @Query("SELECT d FROM DisasterZone d WHERE d.disasterType = :type AND d.status NOT IN ('RESOLVED')")
    List<DisasterZone> findActiveByType(@Param("type") DisasterType type);

    @Query("SELECT d FROM DisasterZone d WHERE d.status NOT IN ('RESOLVED') ORDER BY d.severity DESC")
    List<DisasterZone> findAllActiveOrderBySeverity();

    List<DisasterZone> findByRegionContainingIgnoreCase(String region);
}
