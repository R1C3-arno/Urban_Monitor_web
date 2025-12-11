package com.urbanmonitor.domain.citizen.exception;

/**
 * Thrown when a resource is not found
 */
public class ResourceNotFoundException extends TrafficException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
