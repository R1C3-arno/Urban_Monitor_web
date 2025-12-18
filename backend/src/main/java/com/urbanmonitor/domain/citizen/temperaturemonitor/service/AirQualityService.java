package com.urbanmonitor.domain.citizen.temperaturemonitor.service;

import com.urbanmonitor.domain.citizen.temperaturemonitor.builder.AirQualityGeoJsonBuilder;
import com.urbanmonitor.domain.citizen.temperaturemonitor.calculator.AirQualityStatsCalculator;
import com.urbanmonitor.domain.citizen.temperaturemonitor.calculator.LegendCalculator;
import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import com.urbanmonitor.domain.citizen.temperaturemonitor.repository.AirQualityRepository;
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
 * - Implement IAirQualityService interface
 * - Depend on abstractions: AirQualityGeoJsonBuilder, AirQualityStatsCalculator, LegendCalculator
 * 
 * Open/Closed Principle (OCP):
 * - Có thể thay đổi behavior bằng cách inject các implementations khác
 * - Không cần sửa code service khi thêm tính năng mới
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AirQualityService implements IAirQualityService {

    private final AirQualityRepository repository;
    private final AirQualityGeoJsonBuilder geoJsonBuilder;
    private final AirQualityStatsCalculator statsCalculator;
    private final LegendCalculator legendCalculator;

    @Override
    @Transactional(readOnly = true)
    public List<AirQualityZone> getAllZones() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public AirQualityResponse getDashboardData() {
        // 1. Lấy dữ liệu từ DB
        List<AirQualityZone> dbData = repository.findAll();

        // 2. Delegate tính toán Stats cho StatsCalculator (Strategy Pattern)
        AirQualityResponse.Stats stats = statsCalculator.calculate(dbData);

        // 3. Delegate tính toán Legend cho LegendCalculator
        Map<String, Integer> legend = legendCalculator.calculate(dbData);

        // 4. Delegate build GeoJSON cho GeoJsonBuilder
        AirQualityResponse.GeoJsonData geoJsonData = geoJsonBuilder.build(dbData);

        return AirQualityResponse.builder()
                .stats(stats)
                .legend(legend)
                .mapData(geoJsonData)
                .build();
    }
}
