package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * SINGLE RESPONSIBILITY PRINCIPLE
 * 
 * Match disaster zones với provinces dựa trên region name.
 */
@Component
@RequiredArgsConstructor
public class DisasterMatcher {
    
    private final NameNormalizer nameNormalizer;
    
    /**
     * Find all disasters matching a province name
     */
    public List<DisasterZone> findMatchingDisasters(String provinceName, List<DisasterZone> disasters) {
        return disasters.stream()
            .filter(disaster -> nameNormalizer.matches(disaster.getRegion(), provinceName))
            .collect(Collectors.toList());
    }
    
    /**
     * Find the most severe disaster from a list
     */
    public Optional<DisasterZone> findMostSevere(List<DisasterZone> disasters) {
        if (disasters == null || disasters.isEmpty()) {
            return Optional.empty();
        }
        
        return disasters.stream()
            .max(Comparator.comparing(DisasterZone::getSeverity));
    }
}
