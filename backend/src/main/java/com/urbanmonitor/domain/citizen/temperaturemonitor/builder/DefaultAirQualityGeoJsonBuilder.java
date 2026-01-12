package com.urbanmonitor.domain.citizen.temperaturemonitor.builder;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import com.urbanmonitor.domain.citizen.temperaturemonitor.loader.GeoJsonLoader;
import com.urbanmonitor.domain.citizen.temperaturemonitor.normalizer.NameNormalizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;


@Component
@RequiredArgsConstructor
@Slf4j
public class DefaultAirQualityGeoJsonBuilder implements AirQualityGeoJsonBuilder {

    private final GeoJsonLoader geoJsonLoader;
    private final NameNormalizer nameNormalizer;

    private static final Map<String, String> LEVEL_COLORS = Map.of(
            "GOOD", "#00e400",
            "MODERATE", "#ffff00",
            "UNHEALTHY_SENSITIVE", "#ff7e00",
            "UNHEALTHY", "#ff0000",
            "VERY_UNHEALTHY", "#8f3f97",
            "HAZARDOUS", "#7e0023"
    );

    private static final String NO_DATA_COLOR = "rgba(0, 0, 0, 0)";
    private static final String TYPE_FEATURE_COLLECTION = "FeatureCollection";
    private static final String TYPE_FEATURE = "Feature";

    @Override
    public AirQualityResponse.GeoJsonData build(List<AirQualityZone> backendData) {
        Map<String, Object> rawGeoJson = geoJsonLoader.loadGeoJson();
        
        if (!isValidGeoJson(rawGeoJson)) {
            return buildEmptyGeoJson();
        }

        List<Map<String, Object>> rawFeatures = extractFeatures(rawGeoJson);
        List<AirQualityResponse.Feature> mergedFeatures = mergeFeatures(rawFeatures, backendData);

        return AirQualityResponse.GeoJsonData.builder()
                .type(TYPE_FEATURE_COLLECTION)
                .features(mergedFeatures)
                .build();
    }

    /**
     * validation logic
     */
    protected boolean isValidGeoJson(Map<String, Object> geoJson) {
        return geoJson != null && geoJson.containsKey("features");
    }

    /**
     * extract features from raw GeoJSON
     */
    @SuppressWarnings("unchecked")
    protected List<Map<String, Object>> extractFeatures(Map<String, Object> rawGeoJson) {
        return (List<Map<String, Object>>) rawGeoJson.get("features");
    }

    /**
     * Core merge logic
     */
    protected List<AirQualityResponse.Feature> mergeFeatures(
            List<Map<String, Object>> rawFeatures, 
            List<AirQualityZone> backendData) {
        
        List<AirQualityResponse.Feature> mergedFeatures = new ArrayList<>();

        log.debug("---------- BẮT ĐẦU MERGE DATA ----------");
        log.debug("Tổng số vùng trong GeoJSON: {}", rawFeatures.size());
        log.debug("Tổng số dữ liệu trong DB: {}", backendData.size());

        for (Map<String, Object> feature : rawFeatures) {
            AirQualityResponse.Feature mergedFeature = mergeFeature(feature, backendData);
            mergedFeatures.add(mergedFeature);
        }

        return mergedFeatures;
    }

    /**
     * Merge single feature with backend data
     */
    @SuppressWarnings("unchecked")
    protected AirQualityResponse.Feature mergeFeature(
            Map<String, Object> feature, 
            List<AirQualityZone> backendData) {
        
        Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
        Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");
        
        String rawJsonName = extractName(properties);
        String jsonNameNormalized = nameNormalizer.normalize(rawJsonName);
        
        Optional<AirQualityZone> match = findMatchingZone(backendData, jsonNameNormalized);
        
        Map<String, Object> newProps = new HashMap<>(properties);
        
        if (match.isPresent()) {
            populateMatchedProperties(newProps, match.get(), rawJsonName);
        } else {
            populateNoDataProperties(newProps, rawJsonName);
        }

        return AirQualityResponse.Feature.builder()
                .type(TYPE_FEATURE)
                .geometry(geometry)
                .properties(newProps)
                .build();
    }

    /**
     * extract name from properties
     */
    protected String extractName(Map<String, Object> properties) {
        return (String) properties.getOrDefault("Name",
                properties.getOrDefault("name",
                        properties.getOrDefault("TEN_TINH", "")));
    }

    /**
     * find matching zone
     */
    protected Optional<AirQualityZone> findMatchingZone(
            List<AirQualityZone> backendData, 
            String normalizedName) {
        
        return backendData.stream()
                .filter(d -> {
                    String dbNameNormalized = nameNormalizer.normalize(d.getProvinceCode());
                    return dbNameNormalized.equals(normalizedName);
                })
                .findFirst();
    }

    /**
     * populate properties when match found
     */
    protected void populateMatchedProperties(
            Map<String, Object> props, 
            AirQualityZone data, 
            String rawJsonName) {
        
        String color = getColorForLevel(data.getSafetyLevel());

        log.info("KHỚP: {} | AQI: {} | Level: {} | Màu: {}",
                rawJsonName, data.getAqi(), data.getSafetyLevel(), color);

        props.put("zoneName", data.getZoneName());
        props.put("provinceCode", data.getProvinceCode());
        props.put("aqi", data.getAqi());
        props.put("safetyLevel", data.getSafetyLevel().name());
        props.put("pm25", data.getPm25());
        props.put("pm10", data.getPm10());
        props.put("temperature", data.getTemperature());
        props.put("humidity", data.getHumidity());
        props.put("color", color);
        props.put("hasData", true);
    }

    /**
     * populate properties when no match found
     */
    protected void populateNoDataProperties(Map<String, Object> props, String rawJsonName) {
        props.put("zoneName", rawJsonName);
        props.put("districtName", "Chưa có trạm đo");
        props.put("aqi", "N/A");
        props.put("color", NO_DATA_COLOR);
        props.put("hasData", false);
    }

    /**
     * get color for safety level
     */
    protected String getColorForLevel(AirQualityZone.SafetyLevel level) {
        return LEVEL_COLORS.getOrDefault(level.name(), NO_DATA_COLOR);
    }

    /**
     * create empty GeoJSON
     */
    protected AirQualityResponse.GeoJsonData buildEmptyGeoJson() {
        return AirQualityResponse.GeoJsonData.builder()
                .type(TYPE_FEATURE_COLLECTION)
                .features(Collections.emptyList())
                .build();
    }
}
