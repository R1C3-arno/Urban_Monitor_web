package com.urbanmonitor.domain.citizen.marketMonitor.controller;

import com.urbanmonitor.domain.citizen.marketMonitor.builder.GeoJsonBuilder;
import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;
import com.urbanmonitor.domain.citizen.marketMonitor.service.ILicensedStoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Dependency Inversion Principle (DIP):
 * Controller depend on ILicensedStoreService interface thay vì concrete class
 * Depend on GeoJsonBuilder interface cho việc build GeoJSON
 * 
 * Single Responsibility Principle (SRP):
 * Controller chỉ handle HTTP requests, delegate logic cho service và builder
 */
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LicensedStoreController {

    private final ILicensedStoreService service;
    private final GeoJsonBuilder geoJsonBuilder;

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
        List<LicensedStore> stores = service.getAll();
        return ResponseEntity.ok(geoJsonBuilder.buildFeatureCollection(stores));
    }

    @GetMapping("/geojson/pharmacy")
    public ResponseEntity<Map<String, Object>> getPharmacyGeoJSON() {
        List<LicensedStore> stores = service.getByType(StoreType.PHARMACY);
        return ResponseEntity.ok(geoJsonBuilder.buildFeatureCollection(stores));
    }

    @GetMapping("/geojson/food")
    public ResponseEntity<Map<String, Object>> getFoodGeoJSON() {
        List<LicensedStore> stores = service.getByType(StoreType.FOOD);
        return ResponseEntity.ok(geoJsonBuilder.buildFeatureCollection(stores));
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
