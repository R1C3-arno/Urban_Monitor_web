package com.urbanmonitor.domain.citizen.validation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * VALIDATION RESULT DTO
 *
 * Encapsulates validation outcome
 */
@Data
@Builder
@AllArgsConstructor
public class ValidationResult {

    private boolean valid;
    private String message;
    private String validatorName;

    /**
     * Create success result
     */
    public static ValidationResult success() {
        return ValidationResult.builder()
                .valid(true)
                .message("Validation passed")
                .build();
    }

    /**
     * Create failure result
     */
    public static ValidationResult failure(String message) {
        return ValidationResult.builder()
                .valid(false)
                .message(message)
                .build();
    }

    /**
     * Create failure result with validator name
     */
    public static ValidationResult failure(String validatorName, String message) {
        return ValidationResult.builder()
                .valid(false)
                .message(message)
                .validatorName(validatorName)
                .build();
    }
}