package com.urbanmonitor.domain.citizen.incidentdetection.service;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;

import java.util.Map;

/**
 * DEPENDENCY INVERSION - Service interface
 */
public interface IncidentPolygonService {

    Map<String, Object> getIncidentGeoJson();

    IncidentStatsDTO getStats();

    IncidentLegendDTO getLegend();
}
