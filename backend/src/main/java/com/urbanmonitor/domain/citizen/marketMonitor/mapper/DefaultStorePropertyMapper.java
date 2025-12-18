package com.urbanmonitor.domain.citizen.marketMonitor.mapper;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm mapping store entity sang properties map
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend class này để thêm properties mới mà không sửa code hiện tại
 */
@Component
public class DefaultStorePropertyMapper implements StorePropertyMapper {

    @Override
    public Map<String, Object> mapToProperties(LicensedStore store) {
        Map<String, Object> properties = new LinkedHashMap<>();
        
        properties.put("id", store.getId());
        properties.put("storeType", store.getStoreType().name());
        properties.put("storeName", store.getStoreName());
        properties.put("ownerName", store.getOwnerName());
        properties.put("description", store.getDescription());
        properties.put("address", store.getAddress());
        properties.put("licenseNumber", store.getLicenseNumber());
        properties.put("licenseIssueDate", formatDate(store.getLicenseIssueDate()));
        properties.put("licenseExpiryDate", formatDate(store.getLicenseExpiryDate()));
        properties.put("licenseStatus", formatLicenseStatus(store.getLicenseStatus()));
        properties.put("taxCompleted", store.getTaxCompleted());
        properties.put("contactPhone", store.getContactPhone());
        properties.put("imageUrl", store.getImageUrl());
        properties.put("rating", store.getRating());
        properties.put("openingHours", store.getOpeningHours());
        
        return properties;
    }

    /**
     * Template Method Pattern - có thể override trong subclass
     */
    protected String formatDate(LocalDate date) {
        return date != null ? date.toString() : null;
    }

    /**
     * Template Method Pattern - có thể override trong subclass
     */
    protected String formatLicenseStatus(LicensedStore.LicenseStatus status) {
        return status != null ? status.name() : null;
    }
}
