package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * LOCATION VALIDATOR
 *
 * Validates coordinates are within valid range and service area
 *
 * Rules:
 * - Lat: -90 to 90
 * - Lng: -180 to 180
 * - Must be within Ho Chi Minh City bounds (optional)
 */
@Slf4j
@Component
public class LocationValidator extends ReportValidator {

    // Ho Chi Minh City approximate bounds
    private static final double HCMC_MIN_LAT = 10.3;
    private static final double HCMC_MAX_LAT = 11.2;
    private static final double HCMC_MIN_LNG = 106.3;
    private static final double HCMC_MAX_LNG = 107.0;

    private static final boolean ENFORCE_HCMC_BOUNDS = false; // Set true to enforce

    @Override
    protected ValidationResult doValidate(TrafficReport report) {
        Double lat = report.getLat();
        Double lng = report.getLng();

        // Check nulls
        if (lat == null || lng == null) {
            log.warn("🚫 Missing coordinates");
            return ValidationResult.failure(
                    getValidatorName(),
                    "Location coordinates are required."
            );
        }

        // Check valid range
        if (lat < -90 || lat > 90) {
            log.warn("🚫 Invalid latitude: {}", lat);
            return ValidationResult.failure(
                    getValidatorName(),
                    "Invalid latitude. Must be between -90 and 90."
            );
        }

        if (lng < -180 || lng > 180) {
            log.warn("🚫 Invalid longitude: {}", lng);
            return ValidationResult.failure(
                    getValidatorName(),
                    "Invalid longitude. Must be between -180 and 180."
            );
        }

        // Check Ho Chi Minh City bounds (optional)
        if (ENFORCE_HCMC_BOUNDS) {
            if (lat < HCMC_MIN_LAT || lat > HCMC_MAX_LAT ||
                    lng < HCMC_MIN_LNG || lng > HCMC_MAX_LNG) {
                log.warn("🚫 Location outside HCMC: ({}, {})", lat, lng);
                return ValidationResult.failure(
                        getValidatorName(),
                        "Location must be within Ho Chi Minh City."
                );
            }
        }

        log.debug("✅ Location validation passed: ({}, {})", lat, lng);
        return ValidationResult.success();
    }
}