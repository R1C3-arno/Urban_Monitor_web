package com.urbanmonitor.domain.citizen.marketMonitor.service;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;

import java.util.List;

/**
 * Dependency Inversion Principle (DIP):
 * Controller sẽ depend on interface này thay vì concrete class
 * 
 * Interface Segregation Principle (ISP):
 * Interface định nghĩa các operations cần thiết cho LicensedStore
 */
public interface ILicensedStoreService {

    /**
     * Get all licensed stores
     * @return list of all stores
     */
    List<LicensedStore> getAll();

    /**
     * Get stores by type
     * @param type store type (PHARMACY, FOOD)
     * @return list of stores matching the type
     */
    List<LicensedStore> getByType(StoreType type);

    /**
     * Get stores by type and license status
     * @param type store type
     * @param status license status
     * @return list of stores matching criteria
     */
    List<LicensedStore> getByTypeAndStatus(StoreType type, LicenseStatus status);

    /**
     * Get stores by type and tax completion status
     * @param type store type
     * @param taxCompleted tax completion status
     * @return list of stores matching criteria
     */
    List<LicensedStore> getByTypeAndTaxCompleted(StoreType type, Boolean taxCompleted);

    /**
     * Save a single store
     * @param store store to save
     * @return saved store
     */
    LicensedStore save(LicensedStore store);

    /**
     * Save multiple stores
     * @param stores list of stores to save
     * @return list of saved stores
     */
    List<LicensedStore> saveAll(List<LicensedStore> stores);

    /**
     * Get dashboard data by store type
     * @param type store type
     * @return dashboard response with stats and map data
     */
    MarketDashboardResponse getDashboardByType(StoreType type);
}
