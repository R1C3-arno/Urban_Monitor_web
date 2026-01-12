package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Strategy Pattern:
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
     * validation
     */
    protected boolean isEmptyOrNull(List<AirQualityZone> zones) {
        return zones == null || zones.isEmpty();
    }

    /**
     * filter logic
     */
    protected List<AirQualityZone> filterValidZones(List<AirQualityZone> zones) {
        return zones.stream()
                .filter(z -> z.getAqi() != null)
                .toList();
    }

    /**
     * tính total
     */
    protected int calculateTotal(List<AirQualityZone> zones) {
        return zones.size();
    }

    /**
     * tính average
     */
    protected int calculateAverageAqi(List<AirQualityZone> zones) {
        double avg = zones.stream()
                .mapToInt(AirQualityZone::getAqi)
                .average()
                .orElse(0);
        return (int) Math.round(avg);
    }

    /**
     * tìm worst zone
     */
    protected String findWorstZoneName(List<AirQualityZone> zones) {
        return zones.stream()
                .max(Comparator.comparingInt(AirQualityZone::getAqi))
                .map(AirQualityZone::getZoneName)
                .orElse(NO_DATA);
    }

    /**
     * tạo empty stats
     */
    protected AirQualityResponse.Stats buildEmptyStats() {
        return AirQualityResponse.Stats.builder()
                .total(0)
                .avgAqi(0)
                .worst(NO_DATA)
                .build();
    }
}
