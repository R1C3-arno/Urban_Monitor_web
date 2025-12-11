package com.urbanmonitor.domain.citizen.state;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.exception.InvalidStateTransitionException;
import lombok.extern.slf4j.Slf4j;

/**
 * APPROVED STATE
 * Terminal state - no transitions allowed
 *
 * State Pattern: Encapsulates behavior for APPROVED status
 */
@Slf4j
public class ApprovedState implements ReportState {

    @Override
    public void approve(TrafficReport report, String reviewer) {
        log.warn("⚠️ Cannot approve: Report {} is already APPROVED", report.getId());
        throw new InvalidStateTransitionException("APPROVED", "approve");
    }

    @Override
    public void reject(TrafficReport report, String reviewer) {
        log.warn("⚠️ Cannot reject: Report {} is already APPROVED", report.getId());
        throw new InvalidStateTransitionException("APPROVED", "reject");
    }

    @Override
    public String getStateName() {
        return "APPROVED";
    }

    @Override
    public boolean canTransition() {
        return false;
    }
}