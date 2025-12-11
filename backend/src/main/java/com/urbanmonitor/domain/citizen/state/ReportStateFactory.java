package com.urbanmonitor.domain.citizen.state;

import com.urbanmonitor.domain.citizen.entity.TrafficReport.ReportStatus;

/**
 * FACTORY PATTERN
 * Creates appropriate State object based on status
 *
 * SOLID: OCP - Adding new states doesn't break existing code
 */
public class ReportStateFactory {

    public static ReportState createState(ReportStatus status) {
        return switch (status) {
            case PENDING -> new PendingState();
            case APPROVED -> new ApprovedState();
            case REJECTED -> new RejectedState();
        };
    }
}