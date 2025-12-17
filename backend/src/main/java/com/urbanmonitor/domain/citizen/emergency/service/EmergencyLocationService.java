package com.urbanmonitor.domain.citizen.emergency.service;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyStatus;
import com.urbanmonitor.domain.citizen.emergency.repository.EmergencyLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyLocationService {

    private final EmergencyLocationRepository repository;

    @Transactional(readOnly = true)
    public List<EmergencyLocation> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<EmergencyLocation> getByType(EmergencyType type) {
        return repository.findByEmergencyType(type);
    }

    @Transactional(readOnly = true)
    public List<EmergencyLocation> getByTypeAndStatus(EmergencyType type, EmergencyStatus status) {
        return repository.findByEmergencyTypeAndStatus(type, status);
    }

    @Transactional
    public EmergencyLocation save(EmergencyLocation location) {
        return repository.save(location);
    }

    @Transactional
    public List<EmergencyLocation> saveAll(List<EmergencyLocation> locations) {
        return repository.saveAll(locations);
    }

    @Transactional(readOnly = true)
    public EmergencyDashboardResponse getDashboardByType(EmergencyType type) {
        // 1. Lấy dữ liệu từ DB
        List<EmergencyLocation> locations = repository.findByEmergencyType(type);

        // Build GeoJSON chung cho tất cả
        Map<String, Object> geoJson = buildGeoJSON(locations);


        // 2. Tính toán Stats (Logic từ FE chuyển về)
        EmergencyDashboardResponse.Stats stats ;

        switch (type) {
            case FIRE:
            case AMBULANCE:
                stats = calculateAmbulanceFireStats(locations);
                break;
            case CRIME:
                stats = calculateCrimeStats(locations);
                break;
            case FAMILY:
                stats = calculateFamilyStats(locations);
                break;
            default:
                stats = EmergencyDashboardResponse.Stats.builder().build();
        }


        return EmergencyDashboardResponse.builder()
                .stats(stats)
                .mapData(geoJson)
                .build();
    }

    private EmergencyDashboardResponse.Stats calculateStats(List<EmergencyLocation> locations) {
        if (locations == null || locations.isEmpty()) {
            return EmergencyDashboardResponse.Stats.builder()
                    .total(0)
                    .critical(0)
                    .responding(0)
                    .build();
        }

        int total = locations.size();

        // Logic: critical = features.filter(f => f.properties.priority === 'CRITICAL').length
        int critical = (int) locations.stream()
                .filter(l -> l.getPriority() == EmergencyLocation.PriorityLevel.CRITICAL)
                .count();

        // Logic: responding = features.filter(f => f.properties.status === 'RESPONDING').length
        int responding = (int) locations.stream()
                .filter(l -> l.getStatus() == EmergencyStatus.RESPONDING)
                .count();

        return EmergencyDashboardResponse.Stats.builder()
                .total(total)
                .critical(critical)
                .responding(responding)
                .build();
    }



    private EmergencyDashboardResponse.Stats calculateAmbulanceFireStats(List<EmergencyLocation> locations) {
        if (locations.isEmpty()) return EmergencyDashboardResponse.Stats.builder().build();

        int critical = (int) locations.stream()
                .filter(l -> l.getPriority() == EmergencyLocation.PriorityLevel.CRITICAL).count();
        int responding = (int) locations.stream()
                .filter(l -> l.getStatus() == EmergencyStatus.RESPONDING).count();

        return EmergencyDashboardResponse.Stats.builder()
                .total(locations.size())
                .critical(critical)
                .responding(responding)
                .build();
    }

    private EmergencyDashboardResponse.Stats calculateCrimeStats(List<EmergencyLocation> locations) {
        if (locations.isEmpty()) return EmergencyDashboardResponse.Stats.builder().build();

        int active = (int) locations.stream()
                .filter(l -> l.getStatus() == EmergencyStatus.ACTIVE).count();
        int responding = (int) locations.stream()
                .filter(l -> l.getStatus() == EmergencyStatus.RESPONDING).count();

        // Logic: features.slice(0, 5).map(f => f.properties)
        List<Map<String, Object>> recentReports = locations.stream()
                .limit(5)
                .map(this::mapLocationToProperties)
                .collect(Collectors.toList());

        return EmergencyDashboardResponse.Stats.builder()
                .total(locations.size())
                .active(active)
                .responding(responding)
                .recentReports(recentReports)
                .build();
    }

    private EmergencyDashboardResponse.Stats calculateFamilyStats(List<EmergencyLocation> locations) {
        return EmergencyDashboardResponse.Stats.builder()
                .total(locations.size())
                .build();
    }

    // --- HELPER METHODS ---

    private Map<String, Object> mapLocationToProperties(EmergencyLocation loc) {
        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("id", loc.getId());
        properties.put("emergencyType", loc.getEmergencyType().name());
        properties.put("name", loc.getName());
        properties.put("description", loc.getDescription());
        properties.put("address", loc.getAddress());
        properties.put("status", loc.getStatus() != null ? loc.getStatus().name() : null);
        properties.put("priority", loc.getPriority() != null ? loc.getPriority().name() : null);
        properties.put("contactPhone", loc.getContactPhone());
        properties.put("imageUrl", loc.getImageUrl());
        properties.put("reportedAt", loc.getReportedAt() != null ? loc.getReportedAt().toString() : null);
        return properties;
    }

    private Map<String, Object> buildGeoJSON(List<EmergencyLocation> locations) {
        List<Map<String, Object>> features = new ArrayList<>();
        for (EmergencyLocation loc : locations) {
            if (loc.getLongitude() == null || loc.getLatitude() == null) continue;

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");
            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", Arrays.asList(loc.getLongitude(), loc.getLatitude()));
            feature.put("geometry", geometry);
            feature.put("properties", mapLocationToProperties(loc));
            features.add(feature);
        }
        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);
        return featureCollection;
    }
}
