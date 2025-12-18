package com.urbanmonitor.domain.citizen.disasterMonitor.service;

import com.urbanmonitor.domain.citizen.disasterMonitor.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.*;
import com.urbanmonitor.domain.citizen.disasterMonitor.factory.GeoJsonConverterFactory;
import com.urbanmonitor.domain.citizen.disasterMonitor.observer.DisasterZoneEvent;
import com.urbanmonitor.domain.citizen.disasterMonitor.observer.DisasterZoneEventPublisher;
import com.urbanmonitor.domain.citizen.disasterMonitor.repository.DisasterZoneRepository;
import com.urbanmonitor.domain.citizen.disasterMonitor.strategy.StatsCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * SOLID PRINCIPLES IMPLEMENTATION:
 * 
 * S - Single Responsibility:
 *     - Service chỉ orchestrate các operations
 *     - Delegate: Stats calculation → StatsCalculator
 *     - Delegate: GeoJSON conversion → GeoJsonConverterFactory
 *     - Delegate: Event publishing → DisasterZoneEventPublisher
 * 
 * O - Open/Closed:
 *     - Thêm disaster type mới = thêm Strategy mới
 *     - Thêm GeoJSON format mới = thêm Converter mới
 *     - Không cần sửa Service code
 * 
 * L - Liskov Substitution:
 *     - Implement DisasterZoneService interface
 *     - Có thể swap implementation mà không break Controller
 * 
 * I - Interface Segregation:
 *     - Service interface được chia thành logical groups
 *     - Các helper interfaces nhỏ gọn (GeoJsonConverter, DisasterStatsStrategy)
 * 
 * D - Dependency Inversion:
 *     - Depend on abstractions (interfaces), not concretions
 *     - Constructor injection cho tất cả dependencies
 * 
 * DESIGN PATTERNS USED:
 * - Strategy Pattern: StatsCalculator với các DisasterStatsStrategy
 * - Factory Pattern: GeoJsonConverterFactory
 * - Builder Pattern: GeoJsonFeatureBuilder, GeoJsonCollectionBuilder
 * - Observer Pattern: DisasterZoneEventPublisher
 * - Specification Pattern: DisasterZoneSpecifications (có thể dùng với JpaSpecificationExecutor)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DisasterZoneServiceImpl implements DisasterZoneService {

    // Dependencies - all injected via constructor
    private final DisasterZoneRepository repository;
    private final StatsCalculator statsCalculator;
    private final GeoJsonConverterFactory converterFactory;
    private final DisasterZoneEventPublisher eventPublisher;

    //  QUERY OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DisasterZone> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getByType(DisasterType type) {
        return repository.findByDisasterType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getActiveByType(DisasterType type) {
        return repository.findActiveByType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getByTypeAndStatus(DisasterType type, ZoneStatus status) {
        return repository.findByDisasterTypeAndStatus(type, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getByTypeAndSeverity(DisasterType type, SeverityLevel severity) {
        return repository.findByDisasterTypeAndSeverity(type, severity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getAllActiveOrderBySeverity() {
        return repository.findAllActiveOrderBySeverity();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisasterZone> getByRegion(String region) {
        return repository.findByRegionContainingIgnoreCase(region);
    }

    //  COMMAND OPERATIONS

    @Override
    @Transactional
    public DisasterZone save(DisasterZone zone) {
        log.info("Saving disaster zone: {} - {}", zone.getDisasterType(), zone.getName());
        
        boolean isNew = zone.getId() == null;
        DisasterZone saved = repository.save(zone);
        
        // Publish event - Observer Pattern
        DisasterZoneEvent event = isNew 
            ? DisasterZoneEvent.created(saved)
            : DisasterZoneEvent.updated(saved);
        eventPublisher.publish(event);
        
        return saved;
    }

    @Override
    @Transactional
    public List<DisasterZone> saveAll(List<DisasterZone> zones) {
        log.info("Saving {} disaster zones", zones.size());
        List<DisasterZone> saved = repository.saveAll(zones);
        
        // Publish events for each
        saved.forEach(zone -> eventPublisher.publish(DisasterZoneEvent.created(zone)));
        
        return saved;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        log.info("Deleting disaster zone with id: {}", id);
        repository.deleteById(id);
        
        // Publish delete event
        eventPublisher.publish(DisasterZoneEvent.deleted(id));
    }

    @Override
    @Transactional
    public DisasterZone updateStatus(Long id, ZoneStatus newStatus) {
        return repository.findById(id)
            .map(zone -> {
                ZoneStatus previousStatus = zone.getStatus();
                zone.setStatus(newStatus);
                DisasterZone saved = repository.save(zone);
                
                log.info("Updated zone {} status: {} -> {}", id, previousStatus, newStatus);
                
                // Publish status change event - Observer Pattern
                eventPublisher.publish(
                    DisasterZoneEvent.statusChanged(saved, previousStatus, newStatus)
                );
                
                return saved;
            })
            .orElseThrow(() -> new RuntimeException("Disaster zone not found with id: " + id));
    }

    //  GEOJSON OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPolygonGeoJson(List<DisasterZone> zones) {
        // Factory Pattern - get appropriate converter
        GeoJsonConverter converter = converterFactory.getPolygonConverter();
        return converter.convert(zones);
    }

    //  DASHBOARD OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public DisasterDashboardResponse getDashboardData() {
        List<DisasterZone> activeZones = getAllActiveOrderBySeverity();
        
        log.debug("Building dashboard with {} active zones", activeZones.size());
        
        // Strategy Pattern - delegate stats calculation
        DisasterDashboardResponse.Stats stats = statsCalculator.calculate(activeZones);
        
        // Factory Pattern - get merged GeoJSON converter
        GeoJsonConverter converter = converterFactory.getMergedConverter();
        Map<String, Object> mapData = converter.convert(activeZones);
        
        return DisasterDashboardResponse.builder()
            .stats(stats)
            .mapData(mapData)
            .build();
    }
}
