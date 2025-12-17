package com.urbanmonitor.domain.citizen.temperaturemonitor.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import com.urbanmonitor.domain.citizen.temperaturemonitor.repository.AirQualityRepository;
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


@Service
@RequiredArgsConstructor
@Slf4j
public class AirQualityService {
    private final AirQualityRepository airRepo;

    private final ObjectMapper objectMapper;

    private Map<String, Object> rawGeoJson;
    private static final Map<String, String> LEVEL_COLORS = Map.of(
            "GOOD", "#00e400",
            "MODERATE", "#ffff00",
            "UNHEALTHY_SENSITIVE", "#ff7e00",
            "UNHEALTHY", "#ff0000",
            "VERY_UNHEALTHY", "#8f3f97",
            "HAZARDOUS", "#7e0023"
    );

    private static final String NO_DATA_COLOR = "rgba(0, 0, 0, 0)";

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("vietnam-provinces.json");
            InputStream inputStream = resource.getInputStream();
            rawGeoJson = objectMapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException e) {
            log.error("Failed to load GeoJSON file", e);
        }
    }

    @Transactional(readOnly = true)
    public AirQualityResponse getDashboardData() {
        // 1. Lấy dữ liệu từ DB
        List<AirQualityZone> dbData = airRepo.findAll();

        // 2. Tính toán Stats (Logic từ FE calculateStats)
        AirQualityResponse.Stats stats = calculateStats(dbData);

        // 3. Tính toán Legend (Logic từ FE calculateLegend)
        Map<String, Integer> legend = calculateLegend(dbData);

        // 4. Merge Data (Logic từ FE mergeBackendDataWithGeoJSON)
        AirQualityResponse.GeoJsonData geoJsonData = mergeBackendDataWithGeoJSON(dbData);

        return AirQualityResponse.builder()
                .stats(stats)
                .legend(legend)
                .mapData(geoJsonData)
                .build();
    }


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
                .trim();
    }

    // Hàm Merge (mergeBackendDataWithGeoJSON)
    // Trong class AirQualityService.java

    private AirQualityResponse.GeoJsonData mergeBackendDataWithGeoJSON(List<AirQualityZone> backendData) {
        if (rawGeoJson == null || !rawGeoJson.containsKey("features")) {
            return AirQualityResponse.GeoJsonData.builder()
                    .type("FeatureCollection")
                    .features(Collections.emptyList())
                    .build();
        }

        List<Map<String, Object>> rawFeatures = (List<Map<String, Object>>) rawGeoJson.get("features");
        List<AirQualityResponse.Feature> mergedFeatures = new ArrayList<>();

        System.out.println("---------- BẮT ĐẦU MERGE DATA ----------");
        System.out.println("Tổng số vùng trong GeoJSON: " + rawFeatures.size());
        System.out.println("Tổng số dữ liệu trong DB: " + backendData.size());

        for (Map<String, Object> feature : rawFeatures) {
            Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
            Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");

            // Lấy tên từ JSON
            String rawJsonName = (String) properties.getOrDefault("Name",
                    properties.getOrDefault("name",
                            properties.getOrDefault("TEN_TINH", "")));

            String jsonNameNormalized = normalizeName(rawJsonName);

            // --- DEBUG 1: In ra tên tỉnh đang xét trong JSON ---
            // System.out.println("Đang xét JSON: " + rawJsonName + " -> Clean: " + jsonNameNormalized);

            // Tìm trong DB
            Optional<AirQualityZone> match = backendData.stream()
                    .filter(d -> {
                        String dbNameNormalized = normalizeName(d.getProvinceCode());
                        // --- DEBUG 2: Chỉ in ra nếu tên gần giống để đỡ rác log ---
                        if (jsonNameNormalized.contains(dbNameNormalized) || dbNameNormalized.contains(jsonNameNormalized)) {
                            // System.out.println("   So sánh với DB: " + d.getProvinceCode() + " -> Clean: " + dbNameNormalized);
                        }
                        return dbNameNormalized.equals(jsonNameNormalized);
                    })
                    .findFirst();

            Map<String, Object> newProps = new HashMap<>(properties);

            if (match.isPresent()) {
                AirQualityZone data = match.get();
                String color = LEVEL_COLORS.getOrDefault(data.getSafetyLevel().name(), NO_DATA_COLOR);

                // --- DEBUG 3: TÌM THẤY ---
                System.out.println("✅ KHỚP: " + rawJsonName + " | AQI: " + data.getAqi() + " | Level: " + data.getSafetyLevel() + " | Màu: " + color);

                newProps.put("zoneName", data.getZoneName());
                newProps.put("provinceCode", data.getProvinceCode());
                newProps.put("aqi", data.getAqi());
                newProps.put("safetyLevel", data.getSafetyLevel().name());
                newProps.put("pm25", data.getPm25());
                newProps.put("pm10", data.getPm10());
                newProps.put("temperature", data.getTemperature());
                newProps.put("humidity", data.getHumidity());
                newProps.put("color", color); // Quan trọng nhất
                newProps.put("hasData", true);
            } else {
                // --- DEBUG 4: KHÔNG TÌM THẤY ---
                // System.out.println("❌ KHÔNG KHỚP: " + rawJsonName + " (Clean JSON: " + jsonNameNormalized + ")");

                newProps.put("zoneName", rawJsonName);
                newProps.put("districtName", "Chưa có trạm đo");
                newProps.put("aqi", "N/A");
                newProps.put("color", NO_DATA_COLOR);
                newProps.put("hasData", false);
            }

            mergedFeatures.add(AirQualityResponse.Feature.builder()
                    .type("Feature")
                    .geometry(geometry)
                    .properties(newProps)
                    .build());
        }
        System.out.println("---------- KẾT THÚC MERGE ----------");

        return AirQualityResponse.GeoJsonData.builder()
                .type("FeatureCollection")
                .features(mergedFeatures)
                .build();
    }

    // Hàm tính Stats (calculateStats)
    private AirQualityResponse.Stats calculateStats(List<AirQualityZone> backendData) {
        if (backendData == null || backendData.isEmpty()) {
            return AirQualityResponse.Stats.builder().total(0).avgAqi(0).worst("N/A").build();
        }

        List<AirQualityZone> valid = backendData.stream()
                .filter(d -> d.getAqi() != null)
                .toList();

        if (valid.isEmpty()) {
            return AirQualityResponse.Stats.builder().total(0).avgAqi(0).worst("N/A").build();
        }

        int total = valid.size();
        double avg = valid.stream().mapToInt(AirQualityZone::getAqi).average().orElse(0);

        AirQualityZone worstZone = valid.stream()
                .max(Comparator.comparingInt(AirQualityZone::getAqi))
                .orElse(valid.get(0));

        return AirQualityResponse.Stats.builder()
                .total(total)
                .avgAqi((int) Math.round(avg))
                .worst(worstZone.getZoneName())
                .build();
    }

    // Hàm tính Legend (calculateLegend)
    private Map<String, Integer> calculateLegend(List<AirQualityZone> backendData) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        // Khởi tạo map
        counts.put("GOOD", 0);
        counts.put("MODERATE", 0);
        counts.put("UNHEALTHY_SENSITIVE", 0);
        counts.put("UNHEALTHY", 0);
        counts.put("VERY_UNHEALTHY", 0);
        counts.put("HAZARDOUS", 0);

        for (AirQualityZone zone : backendData) {
            if (zone.getSafetyLevel() != null) {
                String key = zone.getSafetyLevel().name();
                counts.put(key, counts.getOrDefault(key, 0) + 1);
            }
        }
        return counts;
    }

    @Transactional(readOnly = true)
    public List<AirQualityZone> getAllZones() {
        return airRepo.findAll();
    }


}