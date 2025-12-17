package com.urbanmonitor.domain.citizen.marketMonitor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "licensed_stores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicensedStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StoreType storeType;

    private String storeName;

    private String ownerName;

    private String description;

    private String address;

    private Double longitude;

    private Double latitude;

    private String licenseNumber;

    private LocalDate licenseIssueDate;

    private LocalDate licenseExpiryDate;

    @Enumerated(EnumType.STRING)
    private LicenseStatus licenseStatus;

    private Boolean taxCompleted;

    private String contactPhone;

    private String imageUrl;

    private Double rating;

    private String openingHours;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum StoreType {
        PHARMACY,
        FOOD
    }

    public enum LicenseStatus {
        ACTIVE,
        EXPIRED,
        SUSPENDED,
        PENDING_RENEWAL
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.licenseStatus == null) {
            this.licenseStatus = LicenseStatus.ACTIVE;
        }
        if (this.taxCompleted == null) {
            this.taxCompleted = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
