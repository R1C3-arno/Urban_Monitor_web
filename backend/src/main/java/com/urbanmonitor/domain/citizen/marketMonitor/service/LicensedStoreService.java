package com.urbanmonitor.domain.citizen.marketMonitor.service;

import com.urbanmonitor.domain.citizen.marketMonitor.builder.GeoJsonBuilder;
import com.urbanmonitor.domain.citizen.marketMonitor.calculator.StatsCalculator;
import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;
import com.urbanmonitor.domain.citizen.marketMonitor.repository.LicensedStoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Single Responsibility Principle (SRP):
 * Service giờ chỉ orchestrate các components, không chứa logic tính toán
 * 
 * Dependency Inversion Principle (DIP):
 * - Implement ILicensedStoreService interface
 * - Depend on GeoJsonBuilder và StatsCalculator abstractions
 * 
 * Open/Closed Principle (OCP):
 * - Có thể thay đổi behavior bằng cách inject các implementations khác
 * - Không cần sửa code service khi thêm tính năng mới
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LicensedStoreService implements ILicensedStoreService {

    private final LicensedStoreRepository repository;
    private final GeoJsonBuilder geoJsonBuilder;
    private final StatsCalculator statsCalculator;

    @Override
    @Transactional(readOnly = true)
    public List<LicensedStore> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LicensedStore> getByType(StoreType type) {
        return repository.findByStoreType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LicensedStore> getByTypeAndStatus(StoreType type, LicenseStatus status) {
        return repository.findByStoreTypeAndLicenseStatus(type, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LicensedStore> getByTypeAndTaxCompleted(StoreType type, Boolean taxCompleted) {
        return repository.findByStoreTypeAndTaxCompleted(type, taxCompleted);
    }

    @Override
    @Transactional
    public LicensedStore save(LicensedStore store) {
        return repository.save(store);
    }

    @Override
    @Transactional
    public List<LicensedStore> saveAll(List<LicensedStore> stores) {
        return repository.saveAll(stores);
    }

    @Override
    @Transactional(readOnly = true)
    public MarketDashboardResponse getDashboardByType(StoreType type) {
        // 1. Lấy dữ liệu từ DB
        List<LicensedStore> stores = repository.findByStoreType(type);

        // 2. Delegate tính toán Stats cho StatsCalculator (Strategy Pattern)
        MarketDashboardResponse.Stats stats = statsCalculator.calculate(stores);

        // 3. Delegate build GeoJSON cho GeoJsonBuilder
        Map<String, Object> geoJson = geoJsonBuilder.buildFeatureCollection(stores);

        return MarketDashboardResponse.builder()
                .stats(stats)
                .mapData(geoJson)
                .build();
    }
}
