package com.urbanmonitor.domain.citizen.incidentdetection.service;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.incidentdetection.factory.LegendFactory;
import com.urbanmonitor.domain.citizen.incidentdetection.mapper.GeoJsonMapper;
import com.urbanmonitor.domain.citizen.incidentdetection.repository.IncidentRepository;
import com.urbanmonitor.domain.citizen.incidentdetection.strategy.IncidentStatsCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * SOLID + Design Patterns:
 * - Strategy Pattern: IncidentStatsCalculator
 * - Factory Pattern: LegendFactory
 * - Builder Pattern: GeoJsonMapper uses builders
 * - Observer Pattern: Ready for event publishing
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IncidentPolygonServiceImpl implements IncidentPolygonService {

    private final IncidentRepository repository;
    private final GeoJsonMapper mapper;
    private final IncidentStatsCalculator statsCalculator;
    private final LegendFactory legendFactory;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getIncidentGeoJson() {
        log.info("Fetching validated incidents for animated icons");

        List<TrafficIncident> incidents = getValidatedIncidents();

        log.info("Found {} validated incidents", incidents.size());

        return mapper.toPointFeatureCollection(incidents);
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentStatsDTO getStats() {
        List<TrafficIncident> incidents = getValidatedIncidents();
        
        // Strategy Pattern - delegate to calculator
        return statsCalculator.calculate(incidents);
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentLegendDTO getLegend() {
        List<TrafficIncident> incidents = getValidatedIncidents();
        
        // Factory Pattern - create legend
        return legendFactory.createLegend(incidents);
    }

    private List<TrafficIncident> getValidatedIncidents() {
        return repository.findValidated(TrafficIncident.ValidationStatus.VALIDATED);
    }
}
