package com.urbanmonitor.domain.citizen.exception;

/**
 * TrafficException
 * Base exception for all traffic-related errors
 *
 * OOP: Exception hierarchy - all custom exceptions extend this
 * SOLID: Single Responsibility - focused on traffic domain
 */
public class TrafficException extends RuntimeException {

    public TrafficException(String message) {
        super(message);
    }

    public TrafficException(String message, Throwable cause) {
        super(message, cause);
    }
}