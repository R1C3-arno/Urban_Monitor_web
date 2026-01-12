package com.urbanmonitor.domain.citizen.marketMonitor.service;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;

import java.util.List;


public interface ILicensedStoreService {

     // Get all licensed stores
    List<LicensedStore> getAll();


     //Get stores by type
    List<LicensedStore> getByType(StoreType type);


     //Get stores by type and license status
    List<LicensedStore> getByTypeAndStatus(StoreType type, LicenseStatus status);


     //Get stores by type and tax completion status
    List<LicensedStore> getByTypeAndTaxCompleted(StoreType type, Boolean taxCompleted);


     //Save a single store
    LicensedStore save(LicensedStore store);


     // Save multiple stores
    List<LicensedStore> saveAll(List<LicensedStore> stores);



    //Get dashboard data by store type
    MarketDashboardResponse getDashboardByType(StoreType type);
}
