package com.urbanmonitor.domain.citizen.disasterMonitor.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.ZoneStatus;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.SeverityLevel;
import com.urbanmonitor.domain.citizen.disasterMonitor.repository.DisasterZoneRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DisasterZoneService {

    private final DisasterZoneRepository repository;

    @Transactional(readOnly = true)
    public List<DisasterZone> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<DisasterZone> getById(Long id) {
        return repository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getByType(DisasterType type) {
        return repository.findByDisasterType(type);
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getActiveByType(DisasterType type) {
        return repository.findActiveByType(type);
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getByTypeAndStatus(DisasterType type, ZoneStatus status) {
        return repository.findByDisasterTypeAndStatus(type, status);
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getByTypeAndSeverity(DisasterType type, SeverityLevel severity) {
        return repository.findByDisasterTypeAndSeverity(type, severity);
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getAllActiveOrderBySeverity() {
        return repository.findAllActiveOrderBySeverity();
    }

    @Transactional(readOnly = true)
    public List<DisasterZone> getByRegion(String region) {
        return repository.findByRegionContainingIgnoreCase(region);
    }

    @Transactional
    public DisasterZone save(DisasterZone zone) {
        log.info("Saving disaster zone: {} - {}", zone.getDisasterType(), zone.getName());
        return repository.save(zone);
    }

    @Transactional
    public List<DisasterZone> saveAll(List<DisasterZone> zones) {
        log.info("Saving {} disaster zones", zones.size());
        return repository.saveAll(zones);
    }

    @Transactional
    public void deleteById(Long id) {
        log.info("Deleting disaster zone with id: {}", id);
        repository.deleteById(id);
    }

    @Transactional
    public DisasterZone updateStatus(Long id, ZoneStatus newStatus) {
        return repository.findById(id)
                .map(zone -> {
                    zone.setStatus(newStatus);
                    log.info("Updated zone {} status to {}", id, newStatus);
                    return repository.save(zone);
                })
                .orElseThrow(() -> new RuntimeException("Disaster zone not found with id: " + id));
    }

    private final ObjectMapper objectMapper;
    private Map<String, Object> rawProvincesGeoJson;
    // Cấu hình màu sắc (Logic từ FE chuyển về)
    private static final Map<String, String> DISASTER_COLORS = Map.of(
            "FLOOD", "#94B4C1",
            "EARTHQUAKE", "#715A5A",
            "HEATWAVE", "#CC561E",
            "STORM", "#005461"
    );

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("geojson/vietnam-provinces.json");
            InputStream inputStream = resource.getInputStream();
            rawProvincesGeoJson = objectMapper.readValue(inputStream, new TypeReference<>() {});
            System.out.println("✅ [DEBUG] Đã load file GeoJSON thành công. Có dữ liệu.");
        } catch (IOException e) {
            System.err.println("❌ [DEBUG] LỖI: Không đọc được file GeoJSON tại data/vietnam-provinces.json");
            e.printStackTrace();
        }
    }
    @Transactional(readOnly = true)
    public DisasterDashboardResponse getDashboardData() {
        List<DisasterZone> activeZones = repository.findAllActiveOrderBySeverity();

        // Debug
        System.out.println("====== BẮT ĐẦU API DASHBOARD ======");
        System.out.println("📊 Số lượng thảm họa đang Active trong DB: " + activeZones.size());
        for(DisasterZone z : activeZones) {
            System.out.println("   -> DB Region: " + z.getRegion() + " | Type: " + z.getDisasterType());
        }

        DisasterDashboardResponse.Stats stats = calculateStats(activeZones);
        Map<String, Object> mergedGeoJson = mergeDisasterDataWithProvinces(activeZones);

        return DisasterDashboardResponse.builder()
                .stats(stats)
                .mapData(mergedGeoJson)
                .build();
    }

    // --- LOGIC TÍNH TOÁN STATS (Port từ FE) ---
    private DisasterDashboardResponse.Stats calculateStats(List<DisasterZone> zones) {
        // Init stats
        DisasterDashboardResponse.StatDetail flood = new DisasterDashboardResponse.StatDetail();
        DisasterDashboardResponse.StatDetail earthquake = new DisasterDashboardResponse.StatDetail();
        DisasterDashboardResponse.StatDetail heatwave = new DisasterDashboardResponse.StatDetail();
        DisasterDashboardResponse.StatDetail storm = new DisasterDashboardResponse.StatDetail();

        for (DisasterZone z : zones) {
            switch (z.getDisasterType()) {
                case FLOOD:
                    flood.setTotal(flood.getTotal() + 1);
                    if (z.getStatus() == ZoneStatus.EMERGENCY) flood.setEmergency(flood.getEmergency() + 1);
                    break;
                case STORM:
                    storm.setTotal(storm.getTotal() + 1);
                    if (z.getStatus() == ZoneStatus.EMERGENCY) storm.setEmergency(storm.getEmergency() + 1);
                    break;
                case EARTHQUAKE:
                    earthquake.setTotal(earthquake.getTotal() + 1);
                    if (z.getStatus() == ZoneStatus.ALERT) earthquake.setAlert(earthquake.getAlert() + 1);
                    break;
                case HEATWAVE:
                    heatwave.setTotal(heatwave.getTotal() + 1);
                    if (z.getSeverity() == SeverityLevel.EXTREME) heatwave.setExtreme(heatwave.getExtreme() + 1);
                    break;
            }
        }

        return DisasterDashboardResponse.Stats.builder()
                .flood(flood)
                .earthquake(earthquake)
                .heatwave(heatwave)
                .storm(storm)
                .build();
    }

    // --- LOGIC MERGE GEOJSON (Port từ FE) ---
    private Map<String, Object> mergeDisasterDataWithProvinces(List<DisasterZone> disasters) {
        if (rawProvincesGeoJson == null || !rawProvincesGeoJson.containsKey("features")) {
            System.err.println("Error: [DEBUG] GeoJSON bị null hoặc không có features!");
            return Map.of("type", "FeatureCollection", "features", Collections.emptyList());
        }

        List<Map<String, Object>> rawFeatures = (List<Map<String, Object>>) rawProvincesGeoJson.get("features");
        List<Map<String, Object>> mergedFeatures = new ArrayList<>();

        System.out.println("Process; [DEBUG] Bắt đầu Merge. Tổng số tỉnh trong GeoJSON: " + rawFeatures.size());

        if(!rawFeatures.isEmpty()) {
            Map<String, Object> firstProps = (Map<String, Object>) rawFeatures.get(0).get("properties");
            System.out.println("Finding:  [DEBUG] Key trong properties của JSON: " + firstProps.keySet());
        }


        for (Map<String, Object> feature : rawFeatures) {
            Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
            Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");

            // Lấy tên tỉnh từ JSON
            String provinceName = (String) properties.getOrDefault("Name",
                    properties.getOrDefault("name",
                            properties.getOrDefault("TEN_TINH",
                                    properties.getOrDefault("NAME_1", ""))));

            String provinceNormalized = normalizeName(provinceName);

            // Tìm tất cả disasters trong province này (Logic contain 2 chiều như FE)
            List<DisasterZone> provinceDisasters = disasters.stream()
                    .filter(d -> {
                        String regionNormalized = normalizeName(d.getRegion());
                        return regionNormalized.contains(provinceNormalized) || provinceNormalized.contains(regionNormalized);
                    })
                    .collect(Collectors.toList());

            Map<String, Object> newProps = new HashMap<>(properties);

            if (!provinceDisasters.isEmpty()) {
                // Lấy disaster nghiêm trọng nhất
                // Enum SeverityLevel đã được order theo thứ tự: LOW, MODERATE, HIGH, SEVERE, EXTREME (0->4)
                // Nên dùng max comparator theo ordinal là chuẩn.
                DisasterZone primaryDisaster = provinceDisasters.stream()
                        .max(Comparator.comparing(DisasterZone::getSeverity))
                        .orElse(provinceDisasters.get(0));

                newProps.put("provinceName", provinceName);
                newProps.put("disasterCount", provinceDisasters.size());
                newProps.put("hasDisaster", true);

                // Copy properties từ disaster sang GeoJSON props
                newProps.put("id", primaryDisaster.getId());
                newProps.put("disasterType", primaryDisaster.getDisasterType().name());
                newProps.put("name", primaryDisaster.getName());
                newProps.put("severity", primaryDisaster.getSeverity().name());
                newProps.put("status", primaryDisaster.getStatus().name());
                newProps.put("region", primaryDisaster.getRegion());
                newProps.put("description", primaryDisaster.getDescription());
                newProps.put("measurementValue", primaryDisaster.getMeasurementValue());
                newProps.put("measurementUnit", primaryDisaster.getMeasurementUnit());
                newProps.put("affectedAreaKm2", primaryDisaster.getAffectedAreaKm2());
                newProps.put("affectedPopulation", primaryDisaster.getAffectedPopulation());
                newProps.put("alertMessage", primaryDisaster.getAlertMessage());
                newProps.put("contactHotline", primaryDisaster.getContactHotline());

                // Set color dựa trên config
                String baseColor = DISASTER_COLORS.getOrDefault(primaryDisaster.getDisasterType().name(), "#666666");
                newProps.put("color", baseColor);

            } else {
                newProps.put("provinceName", provinceName);
                newProps.put("hasDisaster", false);
                newProps.put("color", "transparent");
            }

            Map<String, Object> newFeature = new HashMap<>();
            newFeature.put("type", "Feature");
            newFeature.put("geometry", geometry);
            newFeature.put("properties", newProps);
            mergedFeatures.add(newFeature);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("type", "FeatureCollection");
        result.put("features", mergedFeatures);
        return result;
    }

    // --- LOGIC CHUẨN HÓA TÊN (Port từ FE) ---
    private String normalizeName(String str) {
        if (str == null) return "";
        String temp = str.toLowerCase();
        temp = Normalizer.normalize(temp, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        temp = pattern.matcher(temp).replaceAll("");

        return temp.replace("đ", "d")
                .replace("thanh pho", "")
                .replace("tinh", "")
                .replace("tp.", "")
                .replace("province", "")
                .replace("city", "")
                .trim();
    }

}
