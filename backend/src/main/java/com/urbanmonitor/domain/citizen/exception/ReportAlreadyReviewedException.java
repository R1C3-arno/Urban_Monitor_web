package com.urbanmonitor.domain.citizen.exception;

public class ReportAlreadyReviewedException extends TrafficException {
    public ReportAlreadyReviewedException(String message) {
        super(message);
    }
}