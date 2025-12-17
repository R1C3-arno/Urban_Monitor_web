package com.urbanmonitor.domain.citizen.utilityMonitor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "utility_monitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityMonitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;

    private String address;

    private Double longitude;
    private Double latitude;

    private Double waterUsage;

    private Double electricityUsage;

    private Integer wifiPing;

    @Enumerated(EnumType.STRING)
    private WifiStatus wifiStatus;

    private LocalDateTime measuredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum WifiStatus {
        EXCELLENT,
        GOOD,
        FAIR,
        POOR,
        BAD
    }

    @PrePersist
    @PreUpdate
    public void calculateWifiStatus() {
        if (this.wifiPing == null) return;

        if (this.wifiPing < 20) this.wifiStatus = WifiStatus.EXCELLENT;
        else if (this.wifiPing < 50) this.wifiStatus = WifiStatus.GOOD;
        else if (this.wifiPing < 100) this.wifiStatus = WifiStatus.FAIR;
        else if (this.wifiPing < 200) this.wifiStatus = WifiStatus.POOR;
        else this.wifiStatus = WifiStatus.BAD;
    }
}
