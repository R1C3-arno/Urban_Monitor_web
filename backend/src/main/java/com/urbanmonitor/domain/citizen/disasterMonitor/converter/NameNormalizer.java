package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * SINGLE RESPONSIBILITY PRINCIPLE
 * 
 * Class chỉ có một nhiệm vụ: normalize tên địa danh để so sánh.
 */
@Component
public class NameNormalizer {
    
    private static final Pattern DIACRITICAL_PATTERN = 
        Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    
    /**
     * Normalize Vietnamese province/region name for comparison
     */
    public String normalize(String str) {
        if (str == null) return "";
        
        String temp = str.toLowerCase();
        temp = Normalizer.normalize(temp, Normalizer.Form.NFD);
        temp = DIACRITICAL_PATTERN.matcher(temp).replaceAll("");
        
        return temp
            .replace("đ", "d")
            .replace("thanh pho", "")
            .replace("tinh", "")
            .replace("tp.", "")
            .replace("province", "")
            .replace("city", "")
            .trim();
    }
    
    /**
     * Check if two names match (bidirectional contains)
     */
    public boolean matches(String name1, String name2) {
        String normalized1 = normalize(name1);
        String normalized2 = normalize(name2);
        
        return normalized1.contains(normalized2) || normalized2.contains(normalized1);
    }
}
