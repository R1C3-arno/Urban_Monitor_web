package com.urbanmonitor.domain.citizen.marketMonitor.service;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import com.urbanmonitor.domain.citizen.marketMonitor.repository.LicensedStoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;


@Service
@RequiredArgsConstructor
@Slf4j
public class LicensedStoreService {

    private final LicensedStoreRepository repository;

    @Transactional(readOnly = true)
    public List<LicensedStore> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<LicensedStore> getByType(StoreType type) {
        return repository.findByStoreType(type);
    }

    @Transactional(readOnly = true)
    public List<LicensedStore> getByTypeAndStatus(StoreType type, LicenseStatus status) {
        return repository.findByStoreTypeAndLicenseStatus(type, status);
    }

    @Transactional(readOnly = true)
    public List<LicensedStore> getByTypeAndTaxCompleted(StoreType type, Boolean taxCompleted) {
        return repository.findByStoreTypeAndTaxCompleted(type, taxCompleted);
    }

    @Transactional
    public LicensedStore save(LicensedStore store) {
        return repository.save(store);
    }

    @Transactional
    public List<LicensedStore> saveAll(List<LicensedStore> stores) {
        return repository.saveAll(stores);
    }

    @Transactional(readOnly = true)
    public MarketDashboardResponse getDashboardByType(StoreType type) {
        // 1. Lấy dữ liệu từ DB
        List<LicensedStore> stores = repository.findByStoreType(type);

        // 2. Tính toán Stats (Logic chuyển từ FE về)
        MarketDashboardResponse.Stats stats = calculateStats(stores);

        // 3. Build GeoJSON
        Map<String, Object> geoJson = buildGeoJSON(stores);

        return MarketDashboardResponse.builder()
                .stats(stats)
                .mapData(geoJson)
                .build();
    }

    private MarketDashboardResponse.Stats calculateStats(List<LicensedStore> stores) {
        if (stores == null || stores.isEmpty()) {
            return MarketDashboardResponse.Stats.builder()
                    .total(0)
                    .active(0)
                    .avgRating(0.0)
                    .build();
        }

        int total = stores.size();

        // Logic: active = features.filter(f => f.properties.licenseStatus === 'ACTIVE')
        int active = (int) stores.stream()
                .filter(s -> s.getLicenseStatus() == LicenseStatus.ACTIVE)
                .count();

        // Logic: avgRating = reduce sum / total
        double avg = stores.stream()
                .mapToDouble(s -> s.getRating() != null ? s.getRating() : 0.0)
                .average()
                .orElse(0.0);

        // Làm tròn 1 chữ số thập phân giống toFixed(1)
        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        return MarketDashboardResponse.Stats.builder()
                .total(total)
                .active(active)
                .avgRating(roundedAvg)
                .build();
    }

    private Map<String, Object> buildGeoJSON(List<LicensedStore> stores) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (LicensedStore store : stores) {
            if (store.getLongitude() == null || store.getLatitude() == null) {
                continue;
            }

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");

            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", Arrays.asList(store.getLongitude(), store.getLatitude()));
            feature.put("geometry", geometry);

            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", store.getId());
            properties.put("storeType", store.getStoreType().name());
            properties.put("storeName", store.getStoreName());
            properties.put("ownerName", store.getOwnerName());
            properties.put("description", store.getDescription());
            properties.put("address", store.getAddress());
            properties.put("licenseNumber", store.getLicenseNumber());
            properties.put("licenseIssueDate", store.getLicenseIssueDate() != null ? store.getLicenseIssueDate().toString() : null);
            properties.put("licenseExpiryDate", store.getLicenseExpiryDate() != null ? store.getLicenseExpiryDate().toString() : null);
            properties.put("licenseStatus", store.getLicenseStatus() != null ? store.getLicenseStatus().name() : null);
            properties.put("taxCompleted", store.getTaxCompleted());
            properties.put("contactPhone", store.getContactPhone());
            properties.put("imageUrl", store.getImageUrl());
            properties.put("rating", store.getRating());
            properties.put("openingHours", store.getOpeningHours());
            feature.put("properties", properties);

            features.add(feature);
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);

        return featureCollection;
    }
}
