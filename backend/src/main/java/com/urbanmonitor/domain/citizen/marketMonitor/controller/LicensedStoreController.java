package com.urbanmonitor.domain.citizen.marketMonitor.controller;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;
import com.urbanmonitor.domain.citizen.marketMonitor.service.LicensedStoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LicensedStoreController {

    private final LicensedStoreService service;

    @GetMapping("/data")
    public ResponseEntity<List<LicensedStore>> getAllData() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<List<LicensedStore>> getDataByType(@PathVariable String type) {
        StoreType storeType = StoreType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(service.getByType(storeType));
    }

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getAllGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getAll()));
    }

    @GetMapping("/geojson/pharmacy")
    public ResponseEntity<Map<String, Object>> getPharmacyGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(StoreType.PHARMACY)));
    }

    @GetMapping("/geojson/food")
    public ResponseEntity<Map<String, Object>> getFoodGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(StoreType.FOOD)));
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
    // Endpoint mới cho Dashboard Pharmacy
    @GetMapping("/dashboard/pharmacy")
    public ResponseEntity<MarketDashboardResponse> getPharmacyDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(StoreType.PHARMACY));
    }

    // Endpoint mới cho Dashboard Food
    @GetMapping("/dashboard/food")
    public ResponseEntity<MarketDashboardResponse> getFoodDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(StoreType.FOOD));
    }
}
