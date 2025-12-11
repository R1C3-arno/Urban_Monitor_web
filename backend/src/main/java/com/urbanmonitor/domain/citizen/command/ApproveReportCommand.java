package com.urbanmonitor.domain.citizen.command;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.service.TrafficService;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * APPROVE REPORT COMMAND
 *
 * Encapsulates the "approve report" action
 * Stores previous state for undo
 */
@Slf4j
public class ApproveReportCommand implements AdminCommand {

    private final TrafficService trafficService;
    private final Long reportId;
    private final String reviewer;
    private final String commandId;

    // State for undo
    private TrafficReport.ReportStatus previousStatus;
    private String previousReviewer;
    private LocalDateTime previousReviewedAt;
    private Long createdIncidentId;

    private boolean executed = false;
    private LocalDateTime executedAt;

    public ApproveReportCommand(
            TrafficService trafficService,
            Long reportId,
            String reviewer
    ) {
        this.trafficService = trafficService;
        this.reportId = reportId;
        this.reviewer = reviewer;
        this.commandId = "APPROVE-" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    public void execute() {
        if (executed) {
            log.warn("⚠️ Command {} already executed", commandId);
            return;
        }

        log.info("▶️ Executing: {} - Report ID: {}", getDescription(), reportId);

        try {
            // Save current state for undo
            TrafficReport report = trafficService.getReportById(reportId);
            previousStatus = report.getStatus();
            previousReviewer = report.getReviewedBy();
            previousReviewedAt = report.getReviewedAt();

            // Execute approval
            var incident = trafficService.approveReport(reportId, reviewer);
            createdIncidentId = incident.getId();

            executed = true;
            executedAt = LocalDateTime.now();

            log.info("✅ Command executed: {} - Created incident ID: {}",
                    commandId, createdIncidentId);

        } catch (Exception e) {
            log.error("❌ Command execution failed: {}", commandId, e);
            throw new RuntimeException("Failed to approve report: " + e.getMessage(), e);
        }
    }

    @Override
    public void undo() {
        if (!executed) {
            log.warn("⚠️ Cannot undo: Command {} not executed", commandId);
            return;
        }

        log.info("◀️ Undoing: {} - Report ID: {}", getDescription(), reportId);

        try {
            // Revert report status
            trafficService.revertReportStatus(
                    reportId,
                    previousStatus,
                    previousReviewer,
                    previousReviewedAt
            );

            // Delete created incident
            if (createdIncidentId != null) {
                trafficService.deleteIncident(createdIncidentId);
                log.info("🗑️ Deleted incident ID: {}", createdIncidentId);
            }

            executed = false;
            log.info("✅ Command undone: {}", commandId);

        } catch (Exception e) {
            log.error("❌ Command undo failed: {}", commandId, e);
            throw new RuntimeException("Failed to undo approval: " + e.getMessage(), e);
        }
    }

    @Override
    public String getDescription() {
        return String.format("Approve Report #%d by %s", reportId, reviewer);
    }

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public LocalDateTime getExecutedAt() {
        return executedAt;
    }

    @Override
    public boolean isExecuted() {
        return executed;
    }
}