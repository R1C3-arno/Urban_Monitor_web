package com.urbanmonitor.domain.citizen.validation;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * PROFANITY CHECK VALIDATOR
 *
 * Filters inappropriate content
 *
 * Rules:
 * - Block common profanity words
 * - Block excessive caps (SHOUTING)
 * - Block suspicious patterns
 */
@Slf4j
@Component
public class ProfanityCheckValidator extends ReportValidator {

    // Vietnamese + English bad words (sample - add more as needed)
    private static final List<String> PROFANITY_LIST = Arrays.asList(
            "fuck", "shit", "damn", "hell", "bitch",
            "địt", "đéo", "lồn", "cặc", "đụ"
            // Add more as needed
    );

    private static final Pattern EXCESSIVE_CAPS = Pattern.compile("([A-Z]{5,})");
    private static final Pattern SUSPICIOUS_PATTERN = Pattern.compile("(.)\\1{5,}"); // aaaaaa

    @Override
    protected ValidationResult doValidate(TrafficReport report) {
        String title = report.getTitle();
        String description = report.getDescription();

        if (title == null || description == null) {
            return ValidationResult.success();
        }

        String combinedText = (title + " " + description).toLowerCase();

        // Check profanity
        for (String badWord : PROFANITY_LIST) {
            if (combinedText.contains(badWord.toLowerCase())) {
                log.warn("🚫 Profanity detected: {}", badWord);
                return ValidationResult.failure(
                        getValidatorName(),
                        "Inappropriate content detected. Please use respectful language."
                );
            }
        }

        // Check excessive caps
        if (EXCESSIVE_CAPS.matcher(title).find() ||
                EXCESSIVE_CAPS.matcher(description).find()) {
            log.warn("🚫 Excessive caps detected");
            return ValidationResult.failure(
                    getValidatorName(),
                    "Please avoid writing in ALL CAPS."
            );
        }

        // Check suspicious patterns
        if (SUSPICIOUS_PATTERN.matcher(combinedText).find()) {
            log.warn("🚫 Suspicious pattern detected");
            return ValidationResult.failure(
                    getValidatorName(),
                    "Suspicious content pattern detected."
            );
        }

        log.debug("✅ Profanity check passed");
        return ValidationResult.success();
    }
}