package com.urbanmonitor.domain.citizen.exception;

public class SpamDetectedException extends TrafficException {
    public SpamDetectedException(String message) {
        super(message);
    }
}