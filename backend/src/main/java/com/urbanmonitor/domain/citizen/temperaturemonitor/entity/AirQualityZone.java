package com.urbanmonitor.domain.citizen.temperaturemonitor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "air_quality_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirQualityZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String zoneName;


    // GeoJSON Polygon coordinates (stored as JSON string)

    private String provinceCode;

    // Air Quality Index (0-500)
    private Integer aqi;



    @Enumerated(EnumType.STRING)
    private SafetyLevel safetyLevel;

    // Additional measurements
    private Double pm25;  // PM2.5 level
    private Double pm10;   // PM10 level
    private Double temperature;
    private Double humidity;

    private LocalDateTime measuredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Enums
    public enum SafetyLevel {
        GOOD,        // AQI 0-50 (Green)
        MODERATE,    // AQI 51-100 (Yellow)
        UNHEALTHY_SENSITIVE, // AQI 101-150 (Orange)
        UNHEALTHY,   // AQI 151-200 (Red)
        VERY_UNHEALTHY, // AQI 201-300 (Purple)
        HAZARDOUS    // AQI 301+ (Maroon)
    }

    // Thêm hàm này để tự động tính mức độ an toàn trước khi lưu vào DB
    @PrePersist
    @PreUpdate
    public void calculateSafetyLevel() {
        if (this.aqi == null) return;

        if (this.aqi <= 50) this.safetyLevel = SafetyLevel.GOOD;
        else if (this.aqi <= 100) this.safetyLevel = SafetyLevel.MODERATE;
        else if (this.aqi <= 150) this.safetyLevel = SafetyLevel.UNHEALTHY_SENSITIVE;
        else if (this.aqi <= 200) this.safetyLevel = SafetyLevel.UNHEALTHY;
        else if (this.aqi <= 300) this.safetyLevel = SafetyLevel.VERY_UNHEALTHY;
        else this.safetyLevel = SafetyLevel.HAZARDOUS;
    }
}