package com.urbanmonitor.domain.citizen.state;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.exception.InvalidStateTransitionException;
import lombok.extern.slf4j.Slf4j;

/**
 * REJECTED STATE
 * Terminal state - no transitions allowed
 *
 * State Pattern: Encapsulates behavior for REJECTED status
 */
@Slf4j
public class RejectedState implements ReportState {

    @Override
    public void approve(TrafficReport report, String reviewer) {
        log.warn("⚠️ Cannot approve: Report {} is already REJECTED", report.getId());
        throw new InvalidStateTransitionException("REJECTED", "approve");
    }

    @Override
    public void reject(TrafficReport report, String reviewer) {
        log.warn("⚠️ Cannot reject: Report {} is already REJECTED", report.getId());
        throw new InvalidStateTransitionException("REJECTED", "reject");
    }

    @Override
    public String getStateName() {
        return "REJECTED";
    }

    @Override
    public boolean canTransition() {
        return false;
    }
}