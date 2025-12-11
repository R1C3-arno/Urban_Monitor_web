package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.repository.TrafficReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DUPLICATE CHECK VALIDATOR
 *
 * Prevents duplicate reports for same location
 *
 * Rules:
 * - Check for reports within 100m radius
 * - Within last 30 minutes
 * - Similar title (optional)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DuplicateCheckValidator extends ReportValidator {

    private final TrafficReportRepository reportRepository;

    private static final double DUPLICATE_RADIUS_KM = 0.1; // 100 meters
    private static final int DUPLICATE_WINDOW_MINUTES = 30;

    @Override
    protected ValidationResult doValidate(TrafficReport report) {
        Double lat = report.getLat();
        Double lng = report.getLng();

        if (lat == null || lng == null) {
            return ValidationResult.success();
        }

        // Get recent reports
        LocalDateTime since = LocalDateTime.now().minusMinutes(DUPLICATE_WINDOW_MINUTES);
        List<TrafficReport> recentReports = reportRepository
                .findRecentReportsByIp(report.getReporterIp(), since);

        // Check for nearby duplicates
        for (TrafficReport existing : recentReports) {
            if (existing.getLat() != null && existing.getLng() != null) {
                double distance = calculateDistance(
                        lat, lng,
                        existing.getLat(), existing.getLng()
                );

                if (distance < DUPLICATE_RADIUS_KM) {
                    log.warn("🚫 Duplicate report detected within {}m",
                            (int)(distance * 1000));
                    return ValidationResult.failure(
                            getValidatorName(),
                            "A similar report already exists for this location. " +
                                    "Please check existing reports."
                    );
                }
            }
        }

        log.debug("✅ No duplicate found");
        return ValidationResult.success();
    }

    /**
     * Calculate distance between two points (simplified)
     * Returns distance in kilometers
     */
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double dLat = lat2 - lat1;
        double dLng = lng2 - lng1;
        return Math.sqrt(dLat * dLat + dLng * dLng) * 111; // Rough conversion to km
    }
}