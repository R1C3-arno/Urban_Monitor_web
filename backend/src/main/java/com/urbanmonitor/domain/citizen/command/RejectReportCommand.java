package com.urbanmonitor.domain.citizen.command;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.service.TrafficService;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * REJECT REPORT COMMAND
 *
 * Encapsulates the "reject report" action
 * Stores previous state for undo
 */
@Slf4j
public class RejectReportCommand implements AdminCommand {

    private final TrafficService trafficService;
    private final Long reportId;
    private final String reviewer;
    private final String commandId;

    // State for undo
    private TrafficReport.ReportStatus previousStatus;
    private String previousReviewer;
    private LocalDateTime previousReviewedAt;

    private boolean executed = false;
    private LocalDateTime executedAt;

    public RejectReportCommand(
            TrafficService trafficService,
            Long reportId,
            String reviewer
    ) {
        this.trafficService = trafficService;
        this.reportId = reportId;
        this.reviewer = reviewer;
        this.commandId = "REJECT-" + UUID.randomUUID().toString().substring(0, 8);
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

            // Execute rejection
            trafficService.rejectReport(reportId, reviewer);

            executed = true;
            executedAt = LocalDateTime.now();

            log.info("✅ Command executed: {}", commandId);

        } catch (Exception e) {
            log.error("❌ Command execution failed: {}", commandId, e);
            throw new RuntimeException("Failed to reject report: " + e.getMessage(), e);
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

            executed = false;
            log.info("✅ Command undone: {}", commandId);

        } catch (Exception e) {
            log.error("❌ Command undo failed: {}", commandId, e);
            throw new RuntimeException("Failed to undo rejection: " + e.getMessage(), e);
        }
    }

    @Override
    public String getDescription() {
        return String.format("Reject Report #%d by %s", reportId, reviewer);
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