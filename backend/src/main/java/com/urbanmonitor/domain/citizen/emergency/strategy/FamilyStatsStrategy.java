package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;
import org.springframework.stereotype.Component;

/**
 * Strategy cho FAMILY emergencies.
 * Logic đơn giản: chỉ có total
 */
@Component
public class FamilyStatsStrategy extends AbstractEmergencyStatsStrategy {
    
    @Override
    public boolean supports(EmergencyType type) {
        return type == EmergencyType.FAMILY;
    }
    
    // Không override gì thêm - chỉ dùng total từ base class
}
