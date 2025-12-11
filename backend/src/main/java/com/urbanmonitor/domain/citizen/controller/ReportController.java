package com.urbanmonitor.domain.citizen.controller;

import com.urbanmonitor.domain.citizen.dto.TrafficMapResponse;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.dto.IncidentDTO;
import com.urbanmonitor.domain.citizen.dto.IncidentDetailResponse;
import com.urbanmonitor.domain.citizen.dto.ReportRequest;
import com.urbanmonitor.domain.citizen.dto.ReportResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.mapper.TrafficMapper;
import com.urbanmonitor.domain.citizen.service.TrafficService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.urbanmonitor.domain.citizen.command.*;
import com.urbanmonitor.domain.citizen.validation.*;

/**
 * ReportController
 * Handles user-submitted traffic reports
 *
 * Design Pattern: MVC Pattern (Controller layer)
 *
 * Main endpoint:
 * - POST /api/reports → Submit new traffic report
 *
 * Frontend sends:
 * {
 *   "title": "Tai nạn giao thông",
 *   "description": "Va chạm 2 xe máy",
 *   "lat": 10.762622,
 *   "lng": 106.660172,
 *   "image": "data:image/png;base64,..." // Optional base64
 * }
 *
 * Backend returns:
 * {
 *   "id": 123,
 *   "status": "PENDING",
 *   "created_at": "2024-12-08T10:30:00",
 *   "message": "Report submitted successfully"
 * }
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class ReportController {

    private final TrafficService trafficService;
    private final TrafficMapper trafficMapper;


    private final CommandInvoker commandInvoker;
    private final CommandHistory commandHistory;
    private final ValidationChain validationChain;

    /**
     * POST /api/reports
     * Submit new traffic report
     * 
     * This is the main endpoint called by frontend ReportAccident component
     *
     * Features:
     * - Accepts base64 image
     * - IP-based spam prevention
     * - Input validation
     * - Auto-saves to database with PENDING status
     */
    @PostMapping
    public ResponseEntity<?> submitReport(
            @Valid @RequestBody ReportRequest request,
            BindingResult bindingResult,
            HttpServletRequest httpRequest
    ) {
        log.info("📝 POST /api/reports - Submitting new report: {}", request.getTitle());

        // Validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );

            log.warn("❌ Validation errors: {}", errors);
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // Convert DTO to entity
            TrafficReport report = trafficMapper.toReportEntity(request);

            // ✅ NEW: Validation chain
            ValidationResult validationResult = validationChain.validate(report);
            if (!validationResult.isValid()) {
                log.warn("❌ Validation failed: {}", validationResult.getMessage());
                return ResponseEntity.badRequest().body(Map.of(
                        "error", validationResult.getMessage(),
                        "validator", validationResult.getValidatorName()
                ));
            }

            // Submit report (includes spam prevention)
            TrafficReport saved = trafficService.submitReport(report, httpRequest);

            // Convert to response DTO
            ReportResponse response = trafficMapper.toReportResponse(saved);

            log.info("✅ Report submitted successfully. ID: {}, IP: {}",
                    saved.getId(), saved.getReporterIp());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {
            log.error("❌ Error submitting report", e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "FAILED");

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }

    /**
     * GET /api/reports/pending
     * Get all pending reports (for admin review)
     *
     * Admin endpoint - should be protected in production
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingReports() {
        log.info("📋 GET /api/reports/pending - Fetching pending reports");

        List<TrafficReport> reports = trafficService.getPendingReports();

        // Convert to simple map for easy display
        List<Map<String, Object>> response = reports.stream()
                .map(report -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", report.getId());
                    map.put("title", report.getTitle());
                    map.put("description", report.getDescription());
                    map.put("lat", report.getLat());
                    map.put("lng", report.getLng());
                    map.put("status", report.getStatus().name());
                    map.put("createdAt", report.getCreatedAt());
                    map.put("reporterIp", report.getReporterIp());
                    map.put("hasImage", report.hasImage());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/reports/{id}/approve
     * Approve a report and create incident
     *
     * Admin endpoint - should be protected in production
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Admin") String reviewer
    ) {
        log.info("✅ POST /api/reports/{}/approve - Approving report", id);

        try {

            // ✅ NEW: Use Command Pattern
            ApproveReportCommand command = new ApproveReportCommand(
                    trafficService, id, reviewer
            );
            commandInvoker.execute(command);
            commandHistory.recordSuccess(command);


            var incident = trafficService.approveReport(id, reviewer);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Report approved successfully");
            response.put("incidentId", incident.getId());
            response.put("status", "APPROVED");
            response.put("canUndo", commandInvoker.canUndo());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("❌ Error approving report {}", id, e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * POST /api/reports/{id}/reject
     * Reject a report
     *
     * Admin endpoint - should be protected in production
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Admin") String reviewer
    ) {
        log.info("❌ POST /api/reports/{}/reject - Rejecting report", id);

        try {

            // ✅ NEW: Use Command Pattern
            RejectReportCommand command = new RejectReportCommand(
                    trafficService, id, reviewer
            );

            commandInvoker.execute(command);
            commandHistory.recordSuccess(command);

            trafficService.rejectReport(id, reviewer);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Report rejected successfully");
            response.put("commandId", command.getCommandId());
            response.put("status", "REJECTED");
            response.put("canUndo", commandInvoker.canUndo());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("❌ Error rejecting report {}", id, e);

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * GET /api/reports/{id}
     * Get report details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        log.info("📋 GET /api/reports/{} - Fetching report details", id);

        // This would need implementation in service
        // For now, return simple message
        Map<String, String> response = new HashMap<>();
        response.put("message", "Report detail endpoint");
        response.put("id", id.toString());

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/reports/undo
     * Undo last admin action
     */
    @PostMapping("/undo")
    public ResponseEntity<?> undoLastAction() {
        log.info("◀️ POST /api/reports/undo");

        try {
            if (!commandInvoker.canUndo()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Nothing to undo"
                ));
            }

            commandInvoker.undo();

            return ResponseEntity.ok(Map.of(
                    "message", "Last action undone successfully",
                    "canUndo", commandInvoker.canUndo(),
                    "canRedo", commandInvoker.canRedo()
            ));

        } catch (Exception e) {
            log.error("❌ Error undoing action", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * POST /api/reports/redo
     * Redo last undone action
     */
    @PostMapping("/redo")
    public ResponseEntity<?> redoLastAction() {
        log.info("▶️ POST /api/reports/redo");

        try {
            if (!commandInvoker.canRedo()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Nothing to redo"
                ));
            }

            commandInvoker.redo();

            return ResponseEntity.ok(Map.of(
                    "message", "Action redone successfully",
                    "canUndo", commandInvoker.canUndo(),
                    "canRedo", commandInvoker.canRedo()
            ));

        } catch (Exception e) {
            log.error("❌ Error redoing action", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * GET /api/reports/command-history
     * Get command history
     */
    @GetMapping("/command-history")
    public ResponseEntity<?> getCommandHistory() {
        log.info("📜 GET /api/reports/command-history");

        var status = commandInvoker.getStatus();
        var history = commandHistory.getRecentHistory(20);

        return ResponseEntity.ok(Map.of(
                "invokerStatus", status,
                "recentHistory", history
        ));
    }
}
