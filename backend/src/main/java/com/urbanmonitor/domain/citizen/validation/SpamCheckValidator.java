package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.repository.TrafficReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SPAM CHECK VALIDATOR
 *
 * Prevents spam submissions from same IP
 *
 * Rules:
 * - Max 3 reports per 5 minutes from same IP
 * - Max 10 reports per hour from same IP
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SpamCheckValidator extends ReportValidator {

    private final TrafficReportRepository reportRepository;

    private static final int MAX_REPORTS_PER_5_MIN = 3;
    private static final int MAX_REPORTS_PER_HOUR = 10;

    @Override
    protected ValidationResult doValidate(TrafficReport report) {
        String ip = report.getReporterIp();

        if (ip == null || ip.isEmpty()) {
            log.debug("⚠️ No IP address - skipping spam check");
            return ValidationResult.success();
        }

        // Check 5-minute window
        LocalDateTime fiveMinAgo = LocalDateTime.now().minusMinutes(5);
        List<TrafficReport> recentReports = reportRepository
                .findRecentReportsByIp(ip, fiveMinAgo);

        if (recentReports.size() >= MAX_REPORTS_PER_5_MIN) {
            log.warn("🚫 Spam detected: {} reports from IP {} in last 5 minutes",
                    recentReports.size(), ip);
            return ValidationResult.failure(
                    getValidatorName(),
                    "Too many reports. Please wait 5 minutes before submitting again."
            );
        }

        // Check 1-hour window
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<TrafficReport> hourlyReports = reportRepository
                .findRecentReportsByIp(ip, oneHourAgo);

        if (hourlyReports.size() >= MAX_REPORTS_PER_HOUR) {
            log.warn("🚫 Spam detected: {} reports from IP {} in last hour",
                    hourlyReports.size(), ip);
            return ValidationResult.failure(
                    getValidatorName(),
                    "Daily limit reached. Please try again later."
            );
        }

        log.debug("✅ Spam check passed for IP: {} ({} recent reports)",
                ip, recentReports.size());
        return ValidationResult.success();
    }
}