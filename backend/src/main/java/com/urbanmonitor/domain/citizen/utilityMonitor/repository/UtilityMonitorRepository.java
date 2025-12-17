package com.urbanmonitor.domain.citizen.utilityMonitor.repository;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilityMonitorRepository extends JpaRepository<UtilityMonitor, Long> {

    List<UtilityMonitor> findByWifiStatus(UtilityMonitor.WifiStatus status);

    List<UtilityMonitor> findByWifiPingGreaterThan(Integer ping);
}
