# Refactored LicensedStore Module

## Cấu trúc thư mục

```
com.urbanmonitor.domain.citizen.marketMonitor/
├── builder/
│   ├── GeoJsonBuilder.java          # Interface
│   └── DefaultGeoJsonBuilder.java   # Implementation
├── calculator/
│   ├── StatsCalculator.java         # Interface
│   └── DefaultStatsCalculator.java  # Implementation
├── controller/
│   └── LicensedStoreController.java # Updated
├── dto/
│   └── MarketDashboardResponse.java # Không đổi
├── entity/
│   └── LicensedStore.java           # Không đổi
├── mapper/
│   ├── StorePropertyMapper.java     # Interface
│   └── DefaultStorePropertyMapper.java # Implementation
├── repository/
│   └── LicensedStoreRepository.java # Không đổi
└── service/
    ├── ILicensedStoreService.java   # Interface (mới)
    └── LicensedStoreService.java    # Updated
```

---

## SOLID Principles Áp Dụng

### 1. Single Responsibility Principle (SRP)
Mỗi class chỉ có một lý do để thay đổi:

| Class | Trách nhiệm duy nhất |
|-------|---------------------|
| `DefaultStorePropertyMapper` | Chỉ mapping entity → properties map |
| `DefaultGeoJsonBuilder` | Chỉ build GeoJSON structure |
| `DefaultStatsCalculator` | Chỉ tính toán statistics |
| `LicensedStoreService` | Chỉ orchestrate các components |
| `LicensedStoreController` | Chỉ handle HTTP requests |

### 2. Open/Closed Principle (OCP)
Mở cho extension, đóng cho modification:

- Các class đều có `protected` methods có thể override
- Có thể extend `DefaultStatsCalculator` để thêm metrics mới
- Có thể extend `DefaultGeoJsonBuilder` để support geometry types khác

```java
// Ví dụ: Extend để thêm logic mới
public class PharmacyStatsCalculator extends DefaultStatsCalculator {
    @Override
    protected boolean isActiveStore(LicensedStore store) {
        // Custom logic cho pharmacy
        return super.isActiveStore(store) && store.getTaxCompleted();
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Các implementation có thể thay thế interface:

```java
// Có thể inject bất kỳ implementation nào
@Service
public class LicensedStoreService implements ILicensedStoreService {
    private final GeoJsonBuilder geoJsonBuilder; // Interface
    private final StatsCalculator statsCalculator; // Interface
}
```

### 4. Interface Segregation Principle (ISP)
Interfaces nhỏ, chuyên biệt:

| Interface | Phạm vi |
|-----------|---------|
| `StorePropertyMapper` | Chỉ mapping properties |
| `GeoJsonBuilder` | Chỉ build GeoJSON |
| `StatsCalculator` | Chỉ tính stats |
| `ILicensedStoreService` | Operations cho store |

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```java
// Controller depend on interface, không phải concrete class
public class LicensedStoreController {
    private final ILicensedStoreService service;  // Interface
    private final GeoJsonBuilder geoJsonBuilder;  // Interface
}
```

---

## Design Patterns Áp Dụng

### 1. Strategy Pattern
`StatsCalculator` cho phép thay đổi algorithm tính toán:

```java
// Default strategy
@Component
public class DefaultStatsCalculator implements StatsCalculator { }

// Custom strategy cho specific business rules
@Component
@Primary
public class CustomStatsCalculator implements StatsCalculator { }
```

### 2. Builder Pattern
Đã có sẵn với Lombok `@Builder`, tăng cường với `GeoJsonBuilder`:

```java
// GeoJsonBuilder xây dựng cấu trúc phức tạp từng bước
Map<String, Object> geoJson = geoJsonBuilder.buildFeatureCollection(stores);
```

### 3. Template Method Pattern
Protected methods trong các implementation cho phép customize behavior:

```java
public class DefaultStatsCalculator {
    // Template methods - có thể override
    protected boolean isActiveStore(LicensedStore store) { }
    protected double getStoreRating(LicensedStore store) { }
    protected int calculateActive(List<LicensedStore> stores) { }
}
```

### 4. Factory Method Pattern
Tạo objects phức tạp:

```java
// Factory method trong StatsCalculator
protected MarketDashboardResponse.Stats buildEmptyStats() {
    return MarketDashboardResponse.Stats.builder()
            .total(0)
            .active(0)
            .avgRating(0.0)
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


