package com.urbanmonitor.domain.citizen.state;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;

/**
 * STATE PATTERN - Report Status Management
 *
 * SOLID: ISP - Interface segregation (simple, focused interface)
 * Design Pattern: State
 */
public interface ReportState {
    void approve(TrafficReport report, String reviewer);
    void reject(TrafficReport report, String reviewer);
    String getStateName();
    boolean canTransition();
}