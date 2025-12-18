# Refactored UtilityMonitor Module

## Cấu trúc thư mục

```
com.urbanmonitor.domain.citizen.utilityMonitor/
├── builder/
│   ├── UtilityGeoJsonBuilder.java       # Interface
│   └── DefaultUtilityGeoJsonBuilder.java # Implementation
├── calculator/
│   ├── UtilityStatsCalculator.java      # Interface
│   └── DefaultUtilityStatsCalculator.java # Implementation
├── controller/
│   └── UtilityMonitorController.java    # Updated
├── dto/
│   └── UtilityDashboardResponse.java    # Không đổi
├── entity/
│   └── UtilityMonitor.java              # Không đổi
├── mapper/
│   ├── UtilityPropertyMapper.java       # Interface (mới)
│   └── DefaultUtilityPropertyMapper.java # Implementation (mới)
├── repository/
│   └── UtilityMonitorRepository.java    # Không đổi
└── service/
    ├── IUtilityMonitorService.java      # Interface (mới)
    └── UtilityMonitorService.java       # Updated
```

---

## SOLID Principles Áp Dụng

### 1. Single Responsibility Principle (SRP)
Mỗi class chỉ có một lý do để thay đổi:

| Class | Trách nhiệm duy nhất |
|-------|---------------------|
| `DefaultUtilityPropertyMapper` | Chỉ mapping entity → properties map |
| `DefaultUtilityGeoJsonBuilder` | Chỉ build GeoJSON structure |
| `DefaultUtilityStatsCalculator` | Chỉ tính toán statistics |
| `UtilityMonitorService` | Chỉ orchestrate các components |
| `UtilityMonitorController` | Chỉ handle HTTP requests |

### 2. Open/Closed Principle (OCP)
Mở cho extension, đóng cho modification:

- Các class đều có `protected` methods có thể override
- Có thể extend `DefaultUtilityStatsCalculator` để thêm metrics mới
- Có thể extend `DefaultUtilityGeoJsonBuilder` để support geometry types khác

```java
// Ví dụ: Extend để thêm logic mới
public class CustomUtilityStatsCalculator extends DefaultUtilityStatsCalculator {
    @Override
    protected double calculateAverageWater(List<UtilityMonitor> stations, int total) {
        // Custom logic - chỉ tính cho stations có valid water data
        return stations.stream()
                .filter(s -> s.getWaterUsage() != null && s.getWaterUsage() > 0)
                .mapToDouble(UtilityMonitor::getWaterUsage)
                .average()
                .orElse(0.0);
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Các implementation có thể thay thế interface:

```java
// Có thể inject bất kỳ implementation nào
@Service
public class UtilityMonitorService implements IUtilityMonitorService {
    private final UtilityGeoJsonBuilder geoJsonBuilder;   // Interface
    private final UtilityStatsCalculator statsCalculator; // Interface
}
```

### 4. Interface Segregation Principle (ISP)
Interfaces nhỏ, chuyên biệt:

| Interface | Phạm vi |
|-----------|---------|
| `UtilityPropertyMapper` | Chỉ mapping properties |
| `UtilityGeoJsonBuilder` | Chỉ build GeoJSON |
| `UtilityStatsCalculator` | Chỉ tính stats |
| `IUtilityMonitorService` | Operations cho utility monitor |

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```java
// Controller depend on interface, không phải concrete class
public class UtilityMonitorController {
    private final IUtilityMonitorService service;      // Interface
    private final UtilityGeoJsonBuilder geoJsonBuilder; // Interface
}

// Service depend on interfaces
public class UtilityMonitorService {
    private final UtilityGeoJsonBuilder geoJsonBuilder;   // Interface
    private final UtilityStatsCalculator statsCalculator; // Interface
}
```

---

## Design Patterns Áp Dụng

### 1. Strategy Pattern
`UtilityStatsCalculator` cho phép thay đổi algorithm tính toán:

```java
// Default strategy
@Component
public class DefaultUtilityStatsCalculator implements UtilityStatsCalculator { }

// Custom strategy cho specific business rules
@Component
@Primary
public class WeightedUtilityStatsCalculator implements UtilityStatsCalculator { }
```

### 2. Builder Pattern
`UtilityGeoJsonBuilder` xây dựng cấu trúc GeoJSON phức tạp:

```java
// Builder xây dựng cấu trúc phức tạp từng bước
Map<String, Object> geoJson = geoJsonBuilder.buildFeatureCollection(stations);
```

### 3. Template Method Pattern
Protected methods trong các implementation cho phép customize behavior:

```java
public class DefaultUtilityStatsCalculator {
    // Template methods - có thể override
    protected int calculateTotal(List<UtilityMonitor> stations) { }
    protected double calculateAverageWater(List<UtilityMonitor> stations, int total) { }
    protected double calculateAverageElectricity(List<UtilityMonitor> stations, int total) { }
    protected int calculateAveragePing(List<UtilityMonitor> stations, int total) { }
}

public class DefaultUtilityGeoJsonBuilder {
    // Template methods - có thể override
    protected Map<String, Object> buildPointGeometry(UtilityMonitor station) { }
    protected boolean hasValidCoordinates(UtilityMonitor station) { }
}
```

### 4. Factory Method Pattern
Tạo objects phức tạp:

```java
// Factory method trong StatsCalculator
protected UtilityDashboardResponse.Stats buildEmptyStats() {
    return UtilityDashboardResponse.Stats.builder()
            .totalStations(0)
            .avgWater(0.0)
            .avgElectricity(0.0)
            .avgPing(0)
            .build();
}
```

---

## Lợi ích

1. **Testability**: Dễ unit test từng component riêng biệt
2. **Maintainability**: Thay đổi một component không ảnh hưởng component khác
3. **Extensibility**: Dễ thêm tính năng mới bằng cách extend
4. **Reusability**: Components có thể tái sử dụng ở nơi khác
5. **Loose Coupling**: Các components độc lập với nhau

---

