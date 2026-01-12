package com.urbanmonitor.domain.citizen.utilityMonitor.calculator;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Strategy Pattern:
 */
@Component
public class DefaultUtilityStatsCalculator implements UtilityStatsCalculator {

    private static final int DECIMAL_PRECISION = 1;
    private static final double DEFAULT_VALUE = 0.0;

    @Override
    public UtilityDashboardResponse.Stats calculate(List<UtilityMonitor> stations) {
        if (isEmptyOrNull(stations)) {
            return buildEmptyStats();
        }

        int total = calculateTotal(stations);
        double avgWater = calculateAverageWater(stations, total);
        double avgElectricity = calculateAverageElectricity(stations, total);
        int avgPing = calculateAveragePing(stations, total);

        return UtilityDashboardResponse.Stats.builder()
                .totalStations(total)
                .avgWater(avgWater)
                .avgElectricity(avgElectricity)
                .avgPing(avgPing)
                .build();
    }

    /**
     * validation
     */
    protected boolean isEmptyOrNull(List<UtilityMonitor> stations) {
        return stations == null || stations.isEmpty();
    }

    /**
     * tính total
     */
    protected int calculateTotal(List<UtilityMonitor> stations) {
        return stations.size();
    }

    /**
     * tính average water
     */
    protected double calculateAverageWater(List<UtilityMonitor> stations, int total) {
        double totalWater = stations.stream()
                .mapToDouble(this::getWaterUsage)
                .sum();
        return roundToDecimalPlaces(totalWater / total, DECIMAL_PRECISION);
    }

    /**
     * tính average electricity
     */
    protected double calculateAverageElectricity(List<UtilityMonitor> stations, int total) {
        double totalElec = stations.stream()
                .mapToDouble(this::getElectricityUsage)
                .sum();
        return roundToDecimalPlaces(totalElec / total, DECIMAL_PRECISION);
    }

    /**
     *  tính average ping
     */
    protected int calculateAveragePing(List<UtilityMonitor> stations, int total) {
        int totalPing = stations.stream()
                .mapToInt(this::getWifiPing)
                .sum();
        return (int) Math.round((double) totalPing / total);
    }

    /**
     * lấy water usage
     */
    protected double getWaterUsage(UtilityMonitor station) {
        return station.getWaterUsage() != null ? station.getWaterUsage() : DEFAULT_VALUE;
    }

    /**
     * lấy electricity usage
     */
    protected double getElectricityUsage(UtilityMonitor station) {
        return station.getElectricityUsage() != null ? station.getElectricityUsage() : DEFAULT_VALUE;
    }

    /**
     * lấy wifi ping
     */
    protected int getWifiPing(UtilityMonitor station) {
        return station.getWifiPing() != null ? station.getWifiPing() : 0;
    }

    /**
     * làm tròn số
     */
    protected double roundToDecimalPlaces(double value, int places) {
        double factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }

    /**
     * tạo empty stats
     */
    protected UtilityDashboardResponse.Stats buildEmptyStats() {
        return UtilityDashboardResponse.Stats.builder()
                .totalStations(0)
                .avgWater(DEFAULT_VALUE)
                .avgElectricity(DEFAULT_VALUE)
                .avgPing(0)
                .build();
    }
}
