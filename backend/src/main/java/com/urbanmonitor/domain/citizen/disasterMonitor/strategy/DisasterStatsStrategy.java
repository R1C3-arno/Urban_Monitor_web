package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

/**
 * STRATEGY PATTERN - Interface cho việc tính stats của từng loại disaster.
 * 
 * Mỗi loại disaster (Flood, Earthquake, Heatwave, Storm) có logic riêng
 * để tính các chỉ số đặc biệt (emergency, alert, extreme).
 * 
 * SOLID:
 * - Single Responsibility: Mỗi strategy chỉ xử lý 1 loại disaster
 * - Open/Closed: Thêm disaster type mới = thêm strategy mới
 * - Liskov Substitution: Tất cả strategies đều implement chung interface
 * - Interface Segregation: Interface nhỏ gọn, chỉ 2 methods cần thiết
 * - Dependency Inversion: Service depend on interface, không phải implementation
 */
public interface DisasterStatsStrategy {
    
    /**
     * Kiểm tra strategy này có xử lý được disaster zone này không
     */
    boolean supports(DisasterZone zone);
    
    /**
     * Cập nhật stats cho disaster zone
     */
    void updateStats(StatDetail stats, DisasterZone zone);
}
