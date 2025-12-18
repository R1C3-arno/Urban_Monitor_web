package com.urbanmonitor.domain.citizen.utilityMonitor.service;

import com.urbanmonitor.domain.citizen.utilityMonitor.builder.UtilityGeoJsonBuilder;
import com.urbanmonitor.domain.citizen.utilityMonitor.calculator.UtilityStatsCalculator;
import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.repository.UtilityMonitorRepository;
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
 * - Implement IUtilityMonitorService interface
 * - Depend on UtilityGeoJsonBuilder và UtilityStatsCalculator abstractions
 * 
 * Open/Closed Principle (OCP):
 * - Có thể thay đổi behavior bằng cách inject các implementations khác
 * - Không cần sửa code service khi thêm tính năng mới
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UtilityMonitorService implements IUtilityMonitorService {

    private final UtilityMonitorRepository repository;
    private final UtilityGeoJsonBuilder geoJsonBuilder;
    private final UtilityStatsCalculator statsCalculator;

    @Override
    @Transactional(readOnly = true)
    public List<UtilityMonitor> getAllStations() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public UtilityMonitor saveStation(UtilityMonitor station) {
        return repository.save(station);
    }

    @Override
    @Transactional
    public List<UtilityMonitor> saveAllStations(List<UtilityMonitor> stations) {
        return repository.saveAll(stations);
    }

    @Override
    @Transactional(readOnly = true)
    public UtilityDashboardResponse getDashboardData() {
        // 1. Lấy dữ liệu từ DB
        List<UtilityMonitor> stations = repository.findAll();

        // 2. Delegate tính toán Stats cho StatsCalculator (Strategy Pattern)
        UtilityDashboardResponse.Stats stats = statsCalculator.calculate(stations);

        // 3. Delegate build GeoJSON cho GeoJsonBuilder
        Map<String, Object> geoJson = geoJsonBuilder.buildFeatureCollection(stations);

        return UtilityDashboardResponse.builder()
                .stats(stats)
                .mapData(geoJson)
                .build();
    }
}
