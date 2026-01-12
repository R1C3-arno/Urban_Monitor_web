package com.urbanmonitor.domain.citizen.emergency.service;

import com.urbanmonitor.domain.citizen.emergency.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;
import com.urbanmonitor.domain.citizen.emergency.factory.GeoJsonConverterFactory;
import com.urbanmonitor.domain.citizen.emergency.observer.EmergencyLocationEvent;
import com.urbanmonitor.domain.citizen.emergency.observer.EmergencyLocationEventPublisher;
import com.urbanmonitor.domain.citizen.emergency.repository.EmergencyLocationRepository;
import com.urbanmonitor.domain.citizen.emergency.strategy.EmergencyStatsCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DESIGN PATTERNS: (
 *                  Strategy Pattern: EmergencyStatsCalculator
 *                  Factory Pattern: GeoJsonConverterFactory
 *                  Builder Pattern: GeoJsonPointFeatureBuilder
 *                  Observer Pattern: EmergencyLocationEventPublisher
 *                  )
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyLocationServiceImpl implements EmergencyLocationService {

    private final EmergencyLocationRepository repository;
    private final EmergencyStatsCalculator statsCalculator;
    private final GeoJsonConverterFactory converterFactory;
    private final EmergencyLocationEventPublisher eventPublisher;

    // QUERY OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyLocation> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmergencyLocation> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyLocation> getByType(EmergencyType type) {
        return repository.findByEmergencyType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyLocation> getByTypeAndStatus(EmergencyType type, EmergencyStatus status) {
        return repository.findByEmergencyTypeAndStatus(type, status);
    }

    // COMMAND OPERATIONS

    @Override
    @Transactional
    public EmergencyLocation save(EmergencyLocation location) {
        log.info("Saving emergency location: {} - {}", location.getEmergencyType(), location.getName());
        
        boolean isNew = location.getId() == null;
        EmergencyLocation saved = repository.save(location);
        
        // Observer Pattern - publish event
        EmergencyLocationEvent event = isNew 
            ? EmergencyLocationEvent.created(saved)
            : EmergencyLocationEvent.updated(saved);
        eventPublisher.publish(event);
        
        return saved;
    }

    @Override
    @Transactional
    public List<EmergencyLocation> saveAll(List<EmergencyLocation> locations) {
        log.info("Saving {} emergency locations", locations.size());
        List<EmergencyLocation> saved = repository.saveAll(locations);
        
        saved.forEach(loc -> eventPublisher.publish(EmergencyLocationEvent.created(loc)));
        
        return saved;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        log.info("Deleting emergency location: {}", id);
        repository.deleteById(id);
        eventPublisher.publish(EmergencyLocationEvent.deleted(id));
    }

    @Override
    @Transactional
    public EmergencyLocation updateStatus(Long id, EmergencyStatus newStatus) {
        return repository.findById(id)
            .map(location -> {
                EmergencyStatus previousStatus = location.getStatus();
                location.setStatus(newStatus);
                EmergencyLocation saved = repository.save(location);
                
                log.info("Updated location {} status: {} -> {}", id, previousStatus, newStatus);
                
                eventPublisher.publish(
                    EmergencyLocationEvent.statusChanged(saved, previousStatus, newStatus)
                );
                
                return saved;
            })
            .orElseThrow(() -> new RuntimeException("Emergency location not found: " + id));
    }

    //  GEOJSON OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getGeoJson(List<EmergencyLocation> locations) {
        // Factory Pattern
        GeoJsonConverter converter = converterFactory.getPointConverter();
        return converter.convert(locations);
    }

    //  DASHBOARD OPERATIONS

    @Override
    @Transactional(readOnly = true)
    public EmergencyDashboardResponse getDashboardByType(EmergencyType type) {
        List<EmergencyLocation> locations = repository.findByEmergencyType(type);
        
        log.debug("Building dashboard for {} with {} locations", type, locations.size());
        
        // Strategy Pattern - delegate stats calculation
        EmergencyDashboardResponse.Stats stats = statsCalculator.calculate(type, locations);
        
        // Factory Pattern - get GeoJSON converter
        Map<String, Object> geoJson = getGeoJson(locations);
        
        return EmergencyDashboardResponse.builder()
            .stats(stats)
            .mapData(geoJson)
            .build();
    }
}
