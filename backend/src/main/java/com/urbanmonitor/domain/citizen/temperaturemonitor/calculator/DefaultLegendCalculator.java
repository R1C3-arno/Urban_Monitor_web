package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm tính toán legend counts
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để thêm safety levels mới mà không sửa code hiện tại
 */
@Component
public class DefaultLegendCalculator implements LegendCalculator {

    @Override
    public Map<String, Integer> calculate(List<AirQualityZone> zones) {
        Map<String, Integer> counts = initializeLegendMap();
        
        if (zones == null || zones.isEmpty()) {
            return counts;
        }

        for (AirQualityZone zone : zones) {
            incrementCount(counts, zone);
        }
        
        return counts;
    }

    /**
     * Template Method - có thể override để thêm safety levels khác
     */
    protected Map<String, Integer> initializeLegendMap() {
        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("GOOD", 0);
        counts.put("MODERATE", 0);
        counts.put("UNHEALTHY_SENSITIVE", 0);
        counts.put("UNHEALTHY", 0);
        counts.put("VERY_UNHEALTHY", 0);
        counts.put("HAZARDOUS", 0);
        return counts;
    }

    /**
     * Template Method - có thể override để thay đổi cách increment
     */
    protected void incrementCount(Map<String, Integer> counts, AirQualityZone zone) {
        if (zone.getSafetyLevel() != null) {
            String key = zone.getSafetyLevel().name();
            counts.put(key, counts.getOrDefault(key, 0) + 1);
        }
    }
}
