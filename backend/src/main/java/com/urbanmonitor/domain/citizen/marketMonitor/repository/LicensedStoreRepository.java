package com.urbanmonitor.domain.citizen.marketMonitor.repository;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.StoreType;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore.LicenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicensedStoreRepository extends JpaRepository<LicensedStore, Long> {

    List<LicensedStore> findByStoreType(StoreType type);

    List<LicensedStore> findByLicenseStatus(LicenseStatus status);

    List<LicensedStore> findByStoreTypeAndLicenseStatus(StoreType type, LicenseStatus status);

    List<LicensedStore> findByTaxCompleted(Boolean taxCompleted);

    List<LicensedStore> findByStoreTypeAndTaxCompleted(StoreType type, Boolean taxCompleted);
}
