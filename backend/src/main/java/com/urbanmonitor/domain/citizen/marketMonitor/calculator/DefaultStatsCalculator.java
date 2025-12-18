package com.urbanmonitor.domain.citizen.marketMonitor.calculator;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm tính toán statistics
 * 
 * Strategy Pattern:
 * Default implementation của StatsCalculator strategy
 * Có thể tạo các implementation khác cho các business rules khác nhau
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để thêm metrics mới mà không sửa code hiện tại
 */
@Component
public class DefaultStatsCalculator implements StatsCalculator {

    private static final int DECIMAL_PRECISION = 1;
    private static final double DEFAULT_RATING = 0.0;

    @Override
    public MarketDashboardResponse.Stats calculate(List<LicensedStore> stores) {
        if (isEmptyList(stores)) {
            return buildEmptyStats();
        }

        int total = calculateTotal(stores);
        int active = calculateActive(stores);
        double avgRating = calculateAverageRating(stores);

        return MarketDashboardResponse.Stats.builder()
                .total(total)
                .active(active)
                .avgRating(avgRating)
                .build();
    }

    /**
     * Template Method - có thể override để thay đổi logic validation
     */
    protected boolean isEmptyList(List<LicensedStore> stores) {
        return stores == null || stores.isEmpty();
    }

    /**
     * Template Method - có thể override để thay đổi cách tính total
     */
    protected int calculateTotal(List<LicensedStore> stores) {
        return stores.size();
    }

    /**
     * Template Method - có thể override để thay đổi điều kiện active
     */
    protected int calculateActive(List<LicensedStore> stores) {
        return (int) stores.stream()
                .filter(this::isActiveStore)
                .count();
    }

    /**
     * Template Method - có thể override để thay đổi cách tính average rating
     */
    protected double calculateAverageRating(List<LicensedStore> stores) {
        double avg = stores.stream()
                .mapToDouble(this::getStoreRating)
                .average()
                .orElse(DEFAULT_RATING);

        return roundToDecimalPlaces(avg, DECIMAL_PRECISION);
    }

    /**
     * Helper method - kiểm tra store có active không
     */
    protected boolean isActiveStore(LicensedStore store) {
        return store.getLicenseStatus() == LicenseStatus.ACTIVE;
    }

    /**
     * Helper method - lấy rating với default value
     */
    protected double getStoreRating(LicensedStore store) {
        return store.getRating() != null ? store.getRating() : DEFAULT_RATING;
    }

    /**
     * Helper method - làm tròn số
     */
    protected double roundToDecimalPlaces(double value, int places) {
        double factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }

    /**
     * Factory method - tạo empty stats
     */
    protected MarketDashboardResponse.Stats buildEmptyStats() {
        return MarketDashboardResponse.Stats.builder()
                .total(0)
                .active(0)
                .avgRating(DEFAULT_RATING)
                .build();
    }
}
