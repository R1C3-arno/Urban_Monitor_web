package com.urbanmonitor.domain.citizen.utilityMonitor.service;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.repository.UtilityMonitorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UtilityMonitorService {

    private final UtilityMonitorRepository repository;

    @Transactional(readOnly = true)
    public List<UtilityMonitor> getAllStations() {
        return repository.findAll();
    }

    @Transactional
    public UtilityMonitor saveStation(UtilityMonitor station) {
        return repository.save(station);
    }

    @Transactional
    public List<UtilityMonitor> saveAllStations(List<UtilityMonitor> stations) {
        return repository.saveAll(stations);
    }

    @Transactional(readOnly = true)
    public UtilityDashboardResponse getDashboardData() {
        // 1. Lấy dữ liệu
        List<UtilityMonitor> stations = repository.findAll();

        // 2. Tính toán Stats (Logic từ FE chuyển về)
        UtilityDashboardResponse.Stats stats = calculateStats(stations);

        // 3. Build GeoJSON
        Map<String, Object> geoJson = buildGeoJSON(stations);

        return UtilityDashboardResponse.builder()
                .stats(stats)
                .mapData(geoJson)
                .build();
    }

    private UtilityDashboardResponse.Stats calculateStats(List<UtilityMonitor> stations) {
        if (stations == null || stations.isEmpty()) {
            return UtilityDashboardResponse.Stats.builder()
                    .totalStations(0)
                    .avgWater(0.0)
                    .avgElectricity(0.0)
                    .avgPing(0)
                    .build();
        }

        int total = stations.size();

        // Tính tổng
        double totalWater = stations.stream()
                .mapToDouble(s -> s.getWaterUsage() != null ? s.getWaterUsage() : 0.0)
                .sum();

        double totalElec = stations.stream()
                .mapToDouble(s -> s.getElectricityUsage() != null ? s.getElectricityUsage() : 0.0)
                .sum();

        int totalPing = stations.stream()
                .mapToInt(s -> s.getWifiPing() != null ? s.getWifiPing() : 0)
                .sum();

        // Tính trung bình và làm tròn 1 chữ số thập phân
        double avgWater = Math.round((totalWater / total) * 10.0) / 10.0;
        double avgElec = Math.round((totalElec / total) * 10.0) / 10.0;
        int avgPing = (int) Math.round((double) totalPing / total);

        return UtilityDashboardResponse.Stats.builder()
                .totalStations(total)
                .avgWater(avgWater)
                .avgElectricity(avgElec)
                .avgPing(avgPing)
                .build();
    }

    private Map<String, Object> buildGeoJSON(List<UtilityMonitor> stations) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (UtilityMonitor station : stations) {
            if (station.getLongitude() == null || station.getLatitude() == null) {
                continue;
            }

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");

            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", Arrays.asList(station.getLongitude(), station.getLatitude()));
            feature.put("geometry", geometry);

            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", station.getId());
            properties.put("stationName", station.getStationName());
            properties.put("address", station.getAddress());
            properties.put("waterUsage", station.getWaterUsage());
            properties.put("electricityUsage", station.getElectricityUsage());
            properties.put("wifiPing", station.getWifiPing());
            properties.put("wifiStatus", station.getWifiStatus() != null ? station.getWifiStatus().name() : null);
            properties.put("measuredAt", station.getMeasuredAt() != null ? station.getMeasuredAt().toString() : null);
            feature.put("properties", properties);

            features.add(feature);
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);

        return featureCollection;
    }
}
