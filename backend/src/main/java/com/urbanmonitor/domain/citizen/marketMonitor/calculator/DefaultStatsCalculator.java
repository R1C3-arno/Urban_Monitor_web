package com.urbanmonitor.domain.citizen.marketMonitor.calculator;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import org.springframework.stereotype.Component;

import java.util.List;


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
     * validation
     */
    protected boolean isEmptyList(List<LicensedStore> stores) {
        return stores == null || stores.isEmpty();
    }

    /**
     * tính total
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
     * tính average rating
     */
    protected double calculateAverageRating(List<LicensedStore> stores) {
        double avg = stores.stream()
                .mapToDouble(this::getStoreRating)
                .average()
                .orElse(DEFAULT_RATING);

        return roundToDecimalPlaces(avg, DECIMAL_PRECISION);
    }

    /**
     * kiểm tra store có active không
     */
    protected boolean isActiveStore(LicensedStore store) {
        return store.getLicenseStatus() == LicenseStatus.ACTIVE;
    }

    /**
     * lấy rating với default value
     */
    protected double getStoreRating(LicensedStore store) {
        return store.getRating() != null ? store.getRating() : DEFAULT_RATING;
    }

    /**
     *  làm tròn số
     */
    protected double roundToDecimalPlaces(double value, int places) {
        double factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }

    /**
     * tạo empty stats
     */
    protected MarketDashboardResponse.Stats buildEmptyStats() {
        return MarketDashboardResponse.Stats.builder()
                .total(0)
                .active(0)
                .avgRating(DEFAULT_RATING)
                .build();
    }
}
