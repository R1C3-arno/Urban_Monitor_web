package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;

import java.util.List;

/**
 * STRATEGY PATTERN
 */
public interface EmergencyStatsStrategy {

    boolean supports(EmergencyType type);

    Stats calculateStats(List<EmergencyLocation> locations);
}
