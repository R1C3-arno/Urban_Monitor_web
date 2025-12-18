package com.urbanmonitor.domain.citizen.temperaturemonitor.normalizer;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc normalize tên
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface NameNormalizer {
    
    /**
     * Normalize a string for comparison
     * @param str the string to normalize
     * @return normalized string
     */
    String normalize(String str);
}
