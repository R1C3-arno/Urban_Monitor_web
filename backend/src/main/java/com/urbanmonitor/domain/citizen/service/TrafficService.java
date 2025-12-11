package com.urbanmonitor.domain.citizen.service;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.IncidentStatus;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.IncidentType;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident.SeverityLevel;
import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.entity.TrafficReport.ReportStatus;
import com.urbanmonitor.domain.citizen.repository.TrafficIncidentRepository;
import com.urbanmonitor.domain.citizen.repository.TrafficReportRepository;
import com.urbanmonitor.domain.citizen.exception.*;
import jakarta.annotation.PostConstruct;
import com.urbanmonitor.domain.citizen.observer.IncidentSubject;
import com.urbanmonitor.domain.citizen.observer.LoggingObserver;
import com.urbanmonitor.domain.citizen.observer.StatisticsObserver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * TrafficService
 * Business logic layer for traffic management
 *
 * Design Patterns Applied:
 * - Service Pattern: Business logic separation
 * - Facade Pattern: Hides complexity from controllers
 * - Observer Pattern: Incident notifications
 * - State Pattern: Report status transitions
 * - Transaction Management: @Transactional
 *
 * SOLID Principles:
 * - SRP: Only handles traffic business logic
 * - OCP: Extensible via observers
 * - DIP: Depends on repository abstractions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TrafficService {

    private final TrafficIncidentRepository incidentRepository;
    private final TrafficReportRepository reportRepository;
    private final IncidentSubject incidentSubject;
    private final LoggingObserver loggingObserver;
    private final StatisticsObserver statisticsObserver;

    @PostConstruct
    public void initObservers() {
        incidentSubject.attach(loggingObserver);
        incidentSubject.attach(statisticsObserver);
        log.info("✅ Observers initialized: {} observers attached",
                incidentSubject.getObserverCount());
    }

    // ==================== INCIDENT OPERATIONS ====================

    public List<TrafficIncident> getAllValidatedIncidents() {
        log.info("🔍 TrafficService.getAllValidatedIncidents() - START");

        try {
            List<TrafficIncident> incidents = incidentRepository
                    .findByStatusOrderByCreatedAtDesc(IncidentStatus.VALIDATED);

            log.info("📊 Repository returned {} incidents", incidents.size());

            if (incidents.isEmpty()) {
                log.warn("⚠️ No validated incidents found!");
            } else {
                log.info("✅ Found incidents:");
                incidents.forEach(i ->
                        log.info("  - ID: {}, Title: {}, Status: {}",
                                i.getId(), i.getTitle(), i.getStatus())
                );
            }

            return incidents;

        } catch (Exception e) {
            log.error("❌ Error in getAllValidatedIncidents", e);
            throw e;
        }
    }

    public Optional<TrafficIncident> getIncidentById(Long id) {
        log.info("Fetching incident with ID: {}", id);
        return incidentRepository.findById(id);
    }

    public List<TrafficIncident> getHighPriorityIncidents() {
        return incidentRepository.findHighPriorityIncidents();
    }

    public List<TrafficIncident> getIncidentsInBounds(
            Double minLat, Double maxLat,
            Double minLng, Double maxLng
    ) {
        log.info("Fetching incidents in bounds: [{}, {}] x [{}, {}]",
                minLat, maxLat, minLng, maxLng);
        return incidentRepository.findInBoundingBox(minLat, maxLat, minLng, maxLng);
    }

    public List<TrafficIncident> getRecentIncidents(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return incidentRepository.findRecentIncidents(since);
    }

    @Transactional
    public TrafficIncident createIncident(TrafficIncident incident) {
        log.info("Creating new incident: {}", incident.getTitle());

        setIncidentDefaults(incident);
        TrafficIncident saved = incidentRepository.save(incident);
        incidentSubject.notifyIncidentCreated(saved);

        return saved;
    }

    private void setIncidentDefaults(TrafficIncident incident) {
        if (incident.getStatus() == null) {
            incident.setStatus(IncidentStatus.VALIDATED);
        }
        if (incident.getReporter() == null) {
            incident.setReporter("System");
        }
    }

    @Transactional
    public TrafficIncident updateIncident(Long id, TrafficIncident updates) {
        TrafficIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + id));

        updateIncidentFields(incident, updates);

        log.info("Updated incident ID: {}", id);
        return incidentRepository.save(incident);
    }

    private void updateIncidentFields(TrafficIncident incident, TrafficIncident updates) {
        if (updates.getTitle() != null) {
            incident.setTitle(updates.getTitle());
        }
        if (updates.getDescription() != null) {
            incident.setDescription(updates.getDescription());
        }
        if (updates.getLevel() != null) {
            incident.setLevel(updates.getLevel());
        }
        if (updates.getType() != null) {
            incident.setType(updates.getType());
        }
        if (updates.getStatus() != null) {
            incident.setStatus(updates.getStatus());
        }
    }

    @Transactional
    public void resolveIncident(Long id) {
        TrafficIncident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found: " + id));

        incident.resolve();
        incidentRepository.save(incident);
        incidentSubject.notifyIncidentResolved(incident);

        log.info("Resolved incident ID: {}", id);
    }

    @Transactional
    public void deleteIncident(Long id) {
        log.info("Deleting incident ID: {}", id);
        incidentRepository.deleteById(id);
    }

    // ==================== REPORT OPERATIONS ====================

    @Transactional
    public TrafficReport submitReport(TrafficReport report, HttpServletRequest request) {
        String ipAddress = extractIpAddress(request);
        report.setReporterIp(ipAddress);

        validateSpamPrevention(ipAddress);

        if (report.getStatus() == null) {
            report.setStatus(ReportStatus.PENDING);
        }

        TrafficReport saved = reportRepository.save(report);
        log.info("✅ Report submitted successfully. ID: {}, IP: {}", saved.getId(), ipAddress);

        return saved;
    }

    private void validateSpamPrevention(String ipAddress) {
        LocalDateTime recentThreshold = LocalDateTime.now().minusMinutes(5);
        List<TrafficReport> recentReports = reportRepository
                .findRecentReportsByIp(ipAddress, recentThreshold);

        if (recentReports.size() >= 3) {
            log.warn("🚫 Spam detected from IP: {}", ipAddress);
            throw new SpamDetectedException("Too many reports. Please wait before submitting again.");
        }
    }

    public List<TrafficReport> getPendingReports() {
        return reportRepository.findPendingReports();
    }

// ==================== HELPER METHODS FOR COMMAND PATTERN ====================
    /**
     * Get report by ID (for command pattern)
     */
    public TrafficReport getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));
    }

    /**
     * Revert report status (for undo operation)
     */
    @Transactional
    public void revertReportStatus(
            Long reportId,
            TrafficReport.ReportStatus previousStatus,
            String previousReviewer,
            LocalDateTime previousReviewedAt
    ) {
        TrafficReport report = getReportById(reportId);

        report.setStatus(previousStatus);
        report.setReviewedBy(previousReviewer);
        report.setReviewedAt(previousReviewedAt);

        reportRepository.save(report);

        log.info("🔄 Reverted report {} to status: {}", reportId, previousStatus);
    }

    @Transactional
    public TrafficIncident approveReport(Long reportId, String reviewer) {
        TrafficReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (!report.isPending()) {
            throw new ReportAlreadyReviewedException("Report already reviewed");
        }

        TrafficIncident incident = createIncidentFromReport(report);
        TrafficIncident savedIncident = incidentRepository.save(incident);

        incidentSubject.notifyIncidentCreated(savedIncident);

        report.setIncidentId(savedIncident.getId());
        report.approve(reviewer);
        reportRepository.save(report);

        log.info("✅ Report ID {} approved by {}. Created incident ID: {}",
                reportId, reviewer, savedIncident.getId());

        return savedIncident;
    }

    private TrafficIncident createIncidentFromReport(TrafficReport report) {
        return TrafficIncident.builder()
                .title(report.getTitle())
                .description(report.getDescription())
                .lat(report.getLat())
                .lng(report.getLng())
                .image(report.getImage())
                .type(IncidentType.ACCIDENT)
                .level(SeverityLevel.MEDIUM)
                .status(IncidentStatus.VALIDATED)
                .reporter(report.getReporterUser() != null ?
                        report.getReporterUser() : "User Report")
                .build();
    }

    @Transactional
    public void rejectReport(Long reportId, String reviewer) {
        TrafficReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (!report.isPending()) {
            throw new ReportAlreadyReviewedException("Report already reviewed");
        }

        report.reject(reviewer);
        reportRepository.save(report);

        log.info("🚫 Report ID {} rejected by {}", reportId, reviewer);
    }

    // ==================== STATISTICS ====================

    public IncidentStats getStatistics() {
        return IncidentStats.builder()
                .totalIncidents(incidentRepository.count())
                .validatedIncidents(incidentRepository.countByStatus(IncidentStatus.VALIDATED))
                .highPriorityIncidents(incidentRepository.countByLevel(SeverityLevel.HIGH))
                .pendingReports(reportRepository.countByStatus(ReportStatus.PENDING))
                .build();
    }

    // ==================== HELPER METHODS ====================

    private String extractIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (isInvalidIp(ip)) {
            ip = request.getHeader("X-Real-IP");
        }

        if (isInvalidIp(ip)) {
            ip = request.getRemoteAddr();
        }

        return extractFirstIp(ip);
    }

    private boolean isInvalidIp(String ip) {
        return ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip);
    }

    private String extractFirstIp(String ip) {
        if (ip != null && ip.contains(",")) {
            return ip.split(",")[0].trim();
        }
        return ip;
    }

    // ==================== INNER CLASSES ====================

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class IncidentStats {
        private long totalIncidents;
        private long validatedIncidents;
        private long highPriorityIncidents;
        private long pendingReports;
    }
}