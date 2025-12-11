package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * VALIDATION CHAIN BUILDER
 *
 * Constructs the validation chain
 * Order matters: fast checks first, expensive checks last
 *
 * Chain Order:
 * ===========
 * 1. LocationValidator - Fast, validates coordinates
 * 2. ProfanityCheckValidator - Fast, checks text
 * 3. DuplicateCheckValidator - Medium, DB query
 * 4. SpamCheckValidator - Medium, DB query
 *
 * Usage:
 * =====
 * @Autowired ValidationChain validationChain;
 * ValidationResult result = validationChain.validate(report);
 * if (!result.isValid()) {
 *     throw new ValidationException(result.getMessage());
 * }
 */
@Slf4j
@Component
public class ValidationChain {

    private final ReportValidator chain;

    public ValidationChain(
            LocationValidator locationValidator,
            ProfanityCheckValidator profanityValidator,
            DuplicateCheckValidator duplicateValidator,
            SpamCheckValidator spamValidator
    ) {
        // Build chain in order
        log.info("🔗 Building validation chain...");

        locationValidator
                .setNext(profanityValidator)
                .setNext(duplicateValidator)
                .setNext(spamValidator);

        this.chain = locationValidator;

        log.info("✅ Validation chain built: Location → Profanity → Duplicate → Spam");
    }

    /**
     * Validate report through entire chain
     *
     * @param report Report to validate
     * @return Validation result
     */
    public ValidationResult validate(TrafficReport report) {
        log.debug("🔍 Starting validation chain for report");

        long startTime = System.currentTimeMillis();
        ValidationResult result = chain.validate(report);
        long duration = System.currentTimeMillis() - startTime;

        if (result.isValid()) {
            log.info("✅ Validation passed in {}ms", duration);
        } else {
            log.warn("❌ Validation failed in {}ms: {} - {}",
                    duration, result.getValidatorName(), result.getMessage());
        }

        return result;
    }

    /**
     * Quick validation (skip expensive checks)
     * For testing or when speed is critical
     */
    public ValidationResult quickValidate(TrafficReport report) {
        log.debug("⚡ Quick validation (location + profanity only)");

        // Only location and profanity
        ReportValidator quickChain = new LocationValidator();
        quickChain.setNext(new ProfanityCheckValidator());

        return quickChain.validate(report);
    }
}