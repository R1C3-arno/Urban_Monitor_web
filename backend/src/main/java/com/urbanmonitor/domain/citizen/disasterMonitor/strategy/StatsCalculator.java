package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * STRATEGY PATTERN - Context class
 * 
 * Sử dụng các strategies để tính toán stats cho từng loại disaster.
 * Không cần biết chi tiết logic - chỉ delegate cho strategy phù hợp.
 * 
 * DEPENDENCY INVERSION: Depend on List<DisasterStatsStrategy> interface
 */
@Component
@RequiredArgsConstructor
public class StatsCalculator {
    
    private final List<DisasterStatsStrategy> strategies;
    
    /**
     * Tính stats cho tất cả disaster zones
     */
    public Stats calculate(List<DisasterZone> zones) {
        Map<DisasterType, StatDetail> statsMap = initializeStatsMap();
        
        for (DisasterZone zone : zones) {
            processZone(zone, statsMap);
        }
        
        return Stats.builder()
                .flood(statsMap.get(DisasterType.FLOOD))
                .earthquake(statsMap.get(DisasterType.EARTHQUAKE))
                .heatwave(statsMap.get(DisasterType.HEATWAVE))
                .storm(statsMap.get(DisasterType.STORM))
                .build();
    }
    
    private Map<DisasterType, StatDetail> initializeStatsMap() {
        Map<DisasterType, StatDetail> map = new EnumMap<>(DisasterType.class);
        for (DisasterType type : DisasterType.values()) {
            map.put(type, new StatDetail());
        }
        return map;
    }
    
    private void processZone(DisasterZone zone, Map<DisasterType, StatDetail> statsMap) {
        for (DisasterStatsStrategy strategy : strategies) {
            if (strategy.supports(zone)) {
                StatDetail stats = statsMap.get(zone.getDisasterType());
                strategy.updateStats(stats, zone);
                break; // Chỉ 1 strategy xử lý mỗi zone
            }
        }
    }
}
