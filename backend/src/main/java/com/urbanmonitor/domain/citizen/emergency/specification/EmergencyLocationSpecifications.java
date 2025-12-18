package com.urbanmonitor.domain.citizen.emergency.specification;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;
import org.springframework.data.jpa.domain.Specification;

/**
 * SPECIFICATION PATTERN + OPEN/CLOSED PRINCIPLE
 * 
 * Cho phép tạo các query phức tạp một cách linh hoạt.
 */
public class EmergencyLocationSpecifications {

    private EmergencyLocationSpecifications() {}

    public static Specification<EmergencyLocation> hasType(EmergencyType type) {
        return (root, query, cb) -> 
            type == null ? cb.conjunction() : cb.equal(root.get("emergencyType"), type);
    }

    public static Specification<EmergencyLocation> hasStatus(EmergencyStatus status) {
        return (root, query, cb) -> 
            status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<EmergencyLocation> hasPriority(PriorityLevel priority) {
        return (root, query, cb) -> 
            priority == null ? cb.conjunction() : cb.equal(root.get("priority"), priority);
    }

    public static Specification<EmergencyLocation> isActive() {
        return hasStatus(EmergencyStatus.ACTIVE);
    }

    public static Specification<EmergencyLocation> isResponding() {
        return hasStatus(EmergencyStatus.RESPONDING);
    }

    public static Specification<EmergencyLocation> isCritical() {
        return hasPriority(PriorityLevel.CRITICAL);
    }

    public static Specification<EmergencyLocation> hasValidCoordinates() {
        return (root, query, cb) -> cb.and(
            cb.isNotNull(root.get("longitude")),
            cb.isNotNull(root.get("latitude"))
        );
    }
}
