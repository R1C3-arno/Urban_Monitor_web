package com.urbanmonitor.domain.citizen.entity;

import com.urbanmonitor.domain.citizen.state.ReportState;
import com.urbanmonitor.domain.citizen.state.ReportStateFactory;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * TrafficReport Entity
 * Represents user-submitted traffic reports awaiting review
 *
 * Design Patterns:
 * - Builder Pattern (via @Builder)
 * - Entity Pattern (JPA)
 * - State Pattern (for report status transitions)
 *
 * Workflow:
 * 1. User submits report → PENDING status
 * 2. Admin reviews → APPROVED or REJECTED
 * 3. If APPROVED → creates TrafficIncident
 */
@Entity
@Table(name = "traffic_reports", indexes = {
        @Index(name = "idx_traffic_reports_status", columnList = "status"),
        @Index(name = "idx_traffic_reports_created", columnList = "created_at"),
        @Index(name = "idx_traffic_reports_location", columnList = "lat, lng")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    @Column(nullable = false)
    private Double lat;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    @Column(nullable = false)
    private Double lng;

    @Column(columnDefinition = "TEXT")
    private String image;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "incident_id")
    private Long incidentId;

    @Column(name = "reporter_ip", length = 50)
    private String reporterIp;

    @Column(name = "reporter_user", length = 255)
    private String reporterUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 255)
    private String reviewedBy;

    // ================= STATE PATTERN =================

    @Transient
    private ReportState state;

    @PostLoad
    private void initState() {
        this.state = ReportStateFactory.createState(this.status);
    }

    // ==================== BUSINESS LOGIC ====================

    /**
     * Approve report using State Pattern
     */
    public void approve(String reviewer) {
        if (state == null) {
            initState();
        }
        state.approve(this, reviewer);
        this.state = ReportStateFactory.createState(this.status);
    }

    /**
     * Reject report using State Pattern
     */
    public void reject(String reviewer) {
        if (state == null) {
            initState();
        }
        state.reject(this, reviewer);
        this.state = ReportStateFactory.createState(this.status);
    }

    /**
     * Check if report is pending
     */
    public boolean isPending() {
        return this.status == ReportStatus.PENDING;
    }

    /**
     * Check if report has image
     */
    public boolean hasImage() {
        return this.image != null && !this.image.isEmpty();
    }

    // ==================== ENUMS ====================

    /**
     * Report Status
     */
    public enum ReportStatus {
        PENDING,    // Awaiting review
        APPROVED,   // Approved and converted to incident
        REJECTED    // Rejected by moderator
    }
}