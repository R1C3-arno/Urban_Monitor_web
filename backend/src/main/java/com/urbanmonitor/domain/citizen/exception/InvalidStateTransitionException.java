package com.urbanmonitor.domain.citizen.exception;

/**
 * InvalidStateTransitionException
 * Thrown when an invalid state transition is attempted
 *
 * Usage (State Pattern):
 * - Trying to approve an APPROVED report
 * - Trying to reject a REJECTED report
 * - Any transition not allowed by current state
 *
 * HTTP Status: Should map to 400 BAD REQUEST
 */
public class InvalidStateTransitionException extends TrafficException {

    public InvalidStateTransitionException(String message) {
        super(message);
    }

    public InvalidStateTransitionException(String currentState, String attemptedAction) {
        super(String.format("Cannot perform action '%s' in current state: %s",
                attemptedAction, currentState));
    }
}