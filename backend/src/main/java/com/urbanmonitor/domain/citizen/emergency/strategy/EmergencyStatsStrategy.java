package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;

import java.util.List;

/**
 * STRATEGY PATTERN - Interface
 * 
 * Mỗi loại emergency (Ambulance, Fire, Crime, Family) có logic tính stats riêng.
 * 
 * SOLID:
 * - Single Responsibility: Mỗi strategy chỉ xử lý 1 loại emergency
 * - Open/Closed: Thêm loại mới = thêm strategy mới
 * - Interface Segregation: Interface nhỏ gọn
 * - Dependency Inversion: Service depend on interface
 */
public interface EmergencyStatsStrategy {
    
    /**
     * Kiểm tra strategy này có xử lý được emergency type này không
     */
    boolean supports(EmergencyType type);
    
    /**
     * Tính stats cho list locations
     */
    Stats calculateStats(List<EmergencyLocation> locations);
}
