package com.urbanmonitor.domain.citizen.disasterMonitor.specification;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.*;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

/**
 * SPECIFICATION PATTERN + OPEN/CLOSED PRINCIPLE
 * 
 * Tạo query mới thì đừng sửa repository.
 * xài được and(), or(), not().
 */
public class DisasterZoneSpecifications {

    private DisasterZoneSpecifications() {}

    /**
     * Specification cho disaster type
     */
    public static Specification<DisasterZone> hasType(DisasterType type) {
        return (root, query, cb) -> 
            type == null ? cb.conjunction() : cb.equal(root.get("disasterType"), type);
    }

    /**
     * Specification cho status
     */
    public static Specification<DisasterZone> hasStatus(ZoneStatus status) {
        return (root, query, cb) -> 
            status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    /**
     * Specification cho severity level
     */
    public static Specification<DisasterZone> hasSeverity(SeverityLevel severity) {
        return (root, query, cb) -> 
            severity == null ? cb.conjunction() : cb.equal(root.get("severity"), severity);
    }

    /**
     * Specification cho các zone đang active (không phải RESOLVED)
     */
    public static Specification<DisasterZone> isActive() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), ZoneStatus.RESOLVED);
    }

    /**
     * Specification cho region search
     */
    public static Specification<DisasterZone> inRegion(String region) {
        return (root, query, cb) -> {
            if (region == null || region.isEmpty()) return cb.conjunction();
            return cb.like(cb.lower(root.get("region")), "%" + region.toLowerCase() + "%");
        };
    }

    /**
     * Specification cho severity >= một level
     */
    public static Specification<DisasterZone> severityAtLeast(SeverityLevel minSeverity) {
        return (root, query, cb) -> 
            minSeverity == null ? cb.conjunction() : 
            cb.greaterThanOrEqualTo(root.get("severity"), minSeverity);
    }

    /**
     * Specification ordering by severity DESC
     */
    public static Specification<DisasterZone> orderBySeverityDesc() {
        return (root, query, cb) -> {
            query.orderBy(cb.desc(root.get("severity")));
            return cb.conjunction();
        };
    }
}
