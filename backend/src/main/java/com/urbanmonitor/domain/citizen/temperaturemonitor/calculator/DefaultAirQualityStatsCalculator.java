package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm tính toán air quality statistics
 * 
 * Strategy Pattern:
 * Default implementation của AirQualityStatsCalculator strategy
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để thêm metrics mới mà không sửa code hiện tại
 */
@Component
public class DefaultAirQualityStatsCalculator implements AirQualityStatsCalculator {

    private static final String NO_DATA = "N/A";

    @Override
    public AirQualityResponse.Stats calculate(List<AirQualityZone> zones) {
        if (isEmptyOrNull(zones)) {
            return buildEmptyStats();
        }

        List<AirQualityZone> validZones = filterValidZones(zones);
        
        if (validZones.isEmpty()) {
            return buildEmptyStats();
        }

        int total = calculateTotal(validZones);
        int avgAqi = calculateAverageAqi(validZones);
        String worst = findWorstZoneName(validZones);

        return AirQualityResponse.Stats.builder()
                .total(total)
                .avgAqi(avgAqi)
                .worst(worst)
                .build();
    }

    /**
     * Template Method - có thể override để thay đổi validation
     */
    protected boolean isEmptyOrNull(List<AirQualityZone> zones) {
        return zones == null || zones.isEmpty();
    }

    /**
     * Template Method - có thể override để thay đổi filter logic
     */
    protected List<AirQualityZone> filterValidZones(List<AirQualityZone> zones) {
        return zones.stream()
                .filter(z -> z.getAqi() != null)
                .toList();
    }

    /**
     * Template Method - có thể override để thay đổi cách tính total
     */
    protected int calculateTotal(List<AirQualityZone> zones) {
        return zones.size();
    }

    /**
     * Template Method - có thể override để thay đổi cách tính average
     */
    protected int calculateAverageAqi(List<AirQualityZone> zones) {
        double avg = zones.stream()
                .mapToInt(AirQualityZone::getAqi)
                .average()
                .orElse(0);
        return (int) Math.round(avg);
    }

    /**
     * Template Method - có thể override để thay đổi cách tìm worst zone
     */
    protected String findWorstZoneName(List<AirQualityZone> zones) {
        return zones.stream()
                .max(Comparator.comparingInt(AirQualityZone::getAqi))
                .map(AirQualityZone::getZoneName)
                .orElse(NO_DATA);
    }

    /**
     * Factory Method - tạo empty stats
     */
    protected AirQualityResponse.Stats buildEmptyStats() {
        return AirQualityResponse.Stats.builder()
                .total(0)
                .avgAqi(0)
                .worst(NO_DATA)
                .build();
    }
}
