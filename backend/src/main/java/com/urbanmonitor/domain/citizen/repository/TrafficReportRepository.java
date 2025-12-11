package com.urbanmonitor.domain.citizen.repository;

import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import com.urbanmonitor.domain.citizen.entity.TrafficReport.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * TrafficReportRepository
 * Data access layer for user-submitted traffic reports
 * 
 * Design Pattern: Repository Pattern
 */
@Repository
public interface TrafficReportRepository extends JpaRepository<TrafficReport, Long> {
    
    /**
     * Find reports by status
     */
    List<TrafficReport> findByStatus(ReportStatus status);
    
    /**
     * Find pending reports (for admin review)
     */
    @Query("SELECT r FROM TrafficReport r WHERE r.status = 'PENDING' ORDER BY r.createdAt DESC")
    List<TrafficReport> findPendingReports();
    
    /**
     * Find reports from specific IP (for spam detection)
     */
    List<TrafficReport> findByReporterIp(String reporterIp);
    
    /**
     * Find recent reports from IP (spam prevention)
     * @param ip Reporter IP
     * @param since Time threshold
     */
    @Query("SELECT r FROM TrafficReport r WHERE " +
           "r.reporterIp = :ip AND r.createdAt >= :since")
    List<TrafficReport> findRecentReportsByIp(
        @Param("ip") String ip,
        @Param("since") LocalDateTime since
    );
    
    /**
     * Count reports by status
     */
    long countByStatus(ReportStatus status);
    
    /**
     * Find reports by user
     */
    List<TrafficReport> findByReporterUser(String reporterUser);
}
