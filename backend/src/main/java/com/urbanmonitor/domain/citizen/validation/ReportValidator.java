package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import lombok.extern.slf4j.Slf4j;

/**
 * CHAIN OF RESPONSIBILITY PATTERN - Report Validation
 *
 * Design Pattern: Chain of Responsibility
 * =======================================
 * - Each validator handles one aspect of validation
 * - Chain continues until failure or completion
 * - Easy to add/remove validators
 *
 * SOLID: Single Responsibility
 * Each validator has one specific check
 *
 * Benefits:
 * ========
 * - Decoupled validation logic
 * - Easy to test individual validators
 * - Flexible validation pipeline
 * - Clear error messages
 *
 * Usage:
 * =====
 * ReportValidator chain = new SpamCheckValidator();
 * chain.setNext(new ProfanityCheckValidator())
 *      .setNext(new LocationValidator());
 *
 * ValidationResult result = chain.validate(report);
 */
@Slf4j
public abstract class ReportValidator {

    protected ReportValidator next;

    /**
     * Set next validator in chain
     *
     * @param next Next validator
     * @return The next validator (for chaining)
     */
    public ReportValidator setNext(ReportValidator next) {
        this.next = next;
        return next;
    }

    /**
     * Validate report
     *
     * @param report Report to validate
     * @return Validation result
     */
    public ValidationResult validate(TrafficReport report) {
        log.debug("🔍 Validating with: {}", this.getClass().getSimpleName());

        // Perform this validator's check
        ValidationResult result = doValidate(report);

        // If failed, stop chain
        if (!result.isValid()) {
            log.warn("❌ Validation failed at: {} - {}",
                    this.getClass().getSimpleName(), result.getMessage());
            return result;
        }

        // If no next validator, validation complete
        if (next == null) {
            log.debug("✅ Validation chain completed successfully");
            return ValidationResult.success();
        }

        // Continue to next validator
        return next.validate(report);
    }

    /**
     * Perform specific validation
     * Subclasses implement their specific logic here
     *
     * @param report Report to validate
     * @return Validation result
     */
    protected abstract ValidationResult doValidate(TrafficReport report);

    /**
     * Get validator name (for logging)
     */
    public String getValidatorName() {
        return this.getClass().getSimpleName();
    }
}