package com.urbanmonitor.domain.citizen.state;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.entity.TrafficReport.ReportStatus;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

/**
 * PENDING STATE
 * Allows transitions to APPROVED or REJECTED
 */
@Slf4j
public class PendingState implements ReportState {

    @Override
    public void approve(TrafficReport report, String reviewer) {
        log.info("🔄 State transition: PENDING → APPROVED (Report ID: {})", report.getId());
        report.setStatus(ReportStatus.APPROVED);
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewedBy(reviewer);
    }

    @Override
    public void reject(TrafficReport report, String reviewer) {
        log.info("🔄 State transition: PENDING → REJECTED (Report ID: {})", report.getId());
        report.setStatus(ReportStatus.REJECTED);
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewedBy(reviewer);
    }

    @Override
    public String getStateName() {
        return "PENDING";
    }

    @Override
    public boolean canTransition() {
        return true;
    }
}