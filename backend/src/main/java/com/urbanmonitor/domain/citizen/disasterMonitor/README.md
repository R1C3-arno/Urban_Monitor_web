# Disaster Zone Module - Refactored Architecture

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)
Mỗi class chỉ có **một lý do để thay đổi**:

| Class | Responsibility |
|-------|----------------|
| `DisasterZoneController` | Handle HTTP requests/responses |
| `DisasterZoneServiceImpl` | Orchestrate business operations |
| `StatsCalculator` | Calculate disaster statistics |
| `CoordinateParser` | Parse JSON coordinates |
| `NameNormalizer` | Normalize Vietnamese names |
| `DisasterMatcher` | Match disasters to provinces |
| `ProvinceNameExtractor` | Extract province names from GeoJSON |
| `DisasterColorConfig` | Configure disaster colors |
| `ProvinceGeoJsonLoader` | Load GeoJSON data |

### 2. Open/Closed Principle (OCP)
**Open for extension, closed for modification**:

- **Strategy Pattern**: Thêm disaster type mới → Thêm Strategy mới
- **Factory Pattern**: Thêm GeoJSON format mới → Thêm Converter mới
- **Observer Pattern**: Thêm event handler mới → Thêm Observer mới
- **Decorator Pattern**: Thêm behavior mới → Wrap với Decorator

### 3. Liskov Substitution Principle (LSP)
Subclasses có thể thay thế base classes:

- `DisasterZoneServiceImpl` implements `DisasterZoneService`
- All strategies implement `DisasterStatsStrategy`
- All converters implement `GeoJsonConverter`

### 4. Interface Segregation Principle (ISP)
Interfaces nhỏ gọn, focused:

- `DisasterStatsStrategy`: 2 methods
- `GeoJsonConverter`: 1 method
- `DisasterZoneObserver`: 1 method

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```java
// Controller depends on interface
private final DisasterZoneService service;

// Service depends on abstractions
private final List<DisasterStatsStrategy> strategies;
private final GeoJsonConverterFactory converterFactory;
```

## Design Patterns Applied (8 Patterns)

### 1. Strategy Pattern
Encapsulate algorithms cho việc tính stats:
- `FloodStatsStrategy`, `StormStatsStrategy`
- `EarthquakeStatsStrategy`, `HeatwaveStatsStrategy`
- `StatsCalculator` as context

### 2. Factory Pattern  
Create appropriate GeoJSON converters:
- `GeoJsonConverterFactory`

### 3. Builder Pattern
Build complex GeoJSON objects:
- `GeoJsonFeatureBuilder`
- `GeoJsonCollectionBuilder`

### 4. Observer Pattern
Notify khi disaster zone changes:
- `DisasterZoneEvent`
- `DisasterZoneEventPublisher`
- `LoggingDisasterZoneObserver`

### 5. Specification Pattern
Dynamic query composition:
- `DisasterZoneSpecifications`

### 6. Template Method Pattern
Define algorithm skeleton:
- `AbstractDisasterStatsStrategy`

### 7. Decorator Pattern
Add behavior dynamically:
- `GeoJsonConverterDecorator`
- `LoggingGeoJsonConverterDecorator`

### 8. Null Object Pattern
Avoid null checks:
- `NullGeoJsonConverter`

## File Structure

```
├── entity/DisasterZone.java
├── repository/DisasterZoneRepository.java
├── service/
│   ├── DisasterZoneService.java (interface)
│   └── DisasterZoneServiceImpl.java
├── controller/DisasterZoneController.java
├── dto/DisasterDashboardResponse.java
├── strategy/
│   ├── DisasterStatsStrategy.java
│   ├── AbstractDisasterStatsStrategy.java
│   ├── FloodStatsStrategy.java
│   ├── StormStatsStrategy.java
│   ├── EarthquakeStatsStrategy.java
│   ├── HeatwaveStatsStrategy.java
│   └── StatsCalculator.java
├── factory/GeoJsonConverterFactory.java
├── builder/
│   ├── GeoJsonFeatureBuilder.java
│   └── GeoJsonCollectionBuilder.java
├── converter/
│   ├── GeoJsonConverter.java
│   ├── GeoJsonConverterDecorator.java
│   ├── LoggingGeoJsonConverterDecorator.java
│   ├── NullGeoJsonConverter.java
│   ├── PolygonGeoJsonConverter.java
│   ├── MergedProvinceGeoJsonConverter.java
│   ├── CoordinateParser.java
│   ├── NameNormalizer.java
│   ├── DisasterMatcher.java
│   └── ProvinceNameExtractor.java
├── observer/
│   ├── DisasterZoneEvent.java
│   ├── DisasterZoneObserver.java
│   ├── DisasterZoneEventPublisher.java
│   └── LoggingDisasterZoneObserver.java
├── specification/DisasterZoneSpecifications.java
└── config/
    ├── DisasterColorConfig.java
    └── ProvinceGeoJsonLoader.java
```

## Summary

| Category | Count |
|----------|-------|
| Design Patterns | 8 |
| SOLID Principles | 5/5 |
| Total Classes | 25+ |
| Interfaces | 4 |
