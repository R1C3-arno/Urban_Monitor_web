# Refactored AirQuality Module

## Cấu trúc thư mục

```
com.urbanmonitor.domain.citizen.temperaturemonitor/
├── builder/
│   ├── AirQualityGeoJsonBuilder.java       # Interface
│   └── DefaultAirQualityGeoJsonBuilder.java # Implementation
├── calculator/
│   ├── AirQualityStatsCalculator.java      # Interface
│   ├── DefaultAirQualityStatsCalculator.java # Implementation
│   ├── LegendCalculator.java               # Interface
│   └── DefaultLegendCalculator.java        # Implementation
├── controller/
│   └── AirQualityController.java           # Updated
├── dto/
│   └── AirQualityResponse.java             # Không đổi
├── entity/
│   └── AirQualityZone.java                 # Không đổi
├── loader/
│   ├── GeoJsonLoader.java                  # Interface (mới)
│   └── ClasspathGeoJsonLoader.java         # Implementation (mới)
├── normalizer/
│   ├── NameNormalizer.java                 # Interface (mới)
│   └── VietnameseNameNormalizer.java       # Implementation (mới)
├── repository/
│   └── AirQualityRepository.java           # Không đổi
└── service/
    ├── IAirQualityService.java             # Interface (mới)
    └── AirQualityService.java              # Updated
```

---

## SOLID Principles Áp Dụng

### 1. Single Responsibility Principle (SRP)
Mỗi class chỉ có một lý do để thay đổi:

| Class | Trách nhiệm duy nhất |
|-------|---------------------|
| `VietnameseNameNormalizer` | Chỉ normalize tên tiếng Việt |
| `ClasspathGeoJsonLoader` | Chỉ load GeoJSON từ classpath |
| `DefaultAirQualityStatsCalculator` | Chỉ tính toán statistics |
| `DefaultLegendCalculator` | Chỉ tính toán legend counts |
| `DefaultAirQualityGeoJsonBuilder` | Chỉ merge và build GeoJSON |
| `AirQualityService` | Chỉ orchestrate các components |
| `AirQualityController` | Chỉ handle HTTP requests |

### 2. Open/Closed Principle (OCP)
Mở cho extension, đóng cho modification:

- Các class đều có `protected` methods có thể override
- Có thể extend `DefaultAirQualityStatsCalculator` để thêm metrics mới
- Có thể extend `ClasspathGeoJsonLoader` để load từ sources khác

```java
// Ví dụ: Extend để load từ URL
public class UrlGeoJsonLoader extends ClasspathGeoJsonLoader {
    @Override
    protected void loadFromClasspath() {
        // Load từ URL thay vì classpath
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Các implementation có thể thay thế interface:

```java
// Có thể inject bất kỳ implementation nào
@Service
public class AirQualityService implements IAirQualityService {
    private final AirQualityGeoJsonBuilder geoJsonBuilder;   // Interface
    private final AirQualityStatsCalculator statsCalculator; // Interface
    private final LegendCalculator legendCalculator;          // Interface
}
```

### 4. Interface Segregation Principle (ISP)
Interfaces nhỏ, chuyên biệt:

| Interface | Phạm vi |
|-----------|---------|
| `NameNormalizer` | Chỉ normalize strings |
| `GeoJsonLoader` | Chỉ load GeoJSON |
| `AirQualityStatsCalculator` | Chỉ tính stats |
| `LegendCalculator` | Chỉ tính legend |
| `AirQualityGeoJsonBuilder` | Chỉ build GeoJSON |
| `IAirQualityService` | Operations cho air quality |

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```java
// Controller depend on interface, không phải concrete class
public class AirQualityController {
    private final IAirQualityService service; // Interface
}

// Service depend on interfaces
public class AirQualityService {
    private final AirQualityGeoJsonBuilder geoJsonBuilder;   // Interface
    private final AirQualityStatsCalculator statsCalculator; // Interface
    private final LegendCalculator legendCalculator;          // Interface
}
```

---

## Design Patterns Áp Dụng

### 1. Strategy Pattern
`AirQualityStatsCalculator` và `LegendCalculator` cho phép thay đổi algorithm:

```java
// Default strategy
@Component
public class DefaultAirQualityStatsCalculator implements AirQualityStatsCalculator { }

// Custom strategy cho specific business rules
@Component
@Primary
public class CustomStatsCalculator implements AirQualityStatsCalculator { }
```

### 2. Builder Pattern
`AirQualityGeoJsonBuilder` xây dựng cấu trúc GeoJSON phức tạp:

```java
// Builder xây dựng cấu trúc phức tạp từng bước
AirQualityResponse.GeoJsonData geoJson = geoJsonBuilder.build(backendData);
```

### 3. Template Method Pattern
Protected methods trong các implementation cho phép customize behavior:

```java
public class DefaultAirQualityStatsCalculator {
    // Template methods - có thể override
    protected List<AirQualityZone> filterValidZones(List<AirQualityZone> zones) { }
    protected int calculateAverageAqi(List<AirQualityZone> zones) { }
    protected String findWorstZoneName(List<AirQualityZone> zones) { }
}

public class DefaultAirQualityGeoJsonBuilder {
    // Template methods - có thể override
    protected String extractName(Map<String, Object> properties) { }
    protected void populateMatchedProperties(...) { }
    protected String getColorForLevel(SafetyLevel level) { }
}
```

### 4. Factory Method Pattern
Tạo objects phức tạp:

```java
// Factory method trong StatsCalculator
protected AirQualityResponse.Stats buildEmptyStats() { }

// Factory method trong GeoJsonBuilder
protected AirQualityResponse.GeoJsonData buildEmptyGeoJson() { }
```

---

## Lợi ích

1. **Testability**: Dễ unit test từng component riêng biệt
   - Mock `GeoJsonLoader` để test `GeoJsonBuilder`
   - Mock `NameNormalizer` để test matching logic
   
2. **Maintainability**: Thay đổi một component không ảnh hưởng component khác
   - Thay đổi cách load GeoJSON không ảnh hưởng logic merge
   - Thay đổi cách tính stats không ảnh hưởng service

3. **Extensibility**: Dễ thêm tính năng mới bằng cách extend
   - Thêm loại loader mới (URL, database)
   - Thêm cách tính stats khác

4. **Reusability**: Components có thể tái sử dụng
   - `VietnameseNameNormalizer` có thể dùng ở modules khác
   - `GeoJsonLoader` có thể dùng cho các loại map khác

5. **Loose Coupling**: Các components độc lập với nhau

---

