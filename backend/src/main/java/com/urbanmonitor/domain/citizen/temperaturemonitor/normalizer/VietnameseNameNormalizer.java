package com.urbanmonitor.domain.citizen.temperaturemonitor.normalizer;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm normalize tên tiếng Việt
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để thêm rules normalize khác mà không sửa code hiện tại
 */
@Component
public class VietnameseNameNormalizer implements NameNormalizer {

    private static final Pattern DIACRITICAL_MARKS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    @Override
    public String normalize(String str) {
        if (str == null) return "";
        
        String temp = str.toLowerCase();
        temp = removeDiacritics(temp);
        temp = removeVietnameseSpecialChars(temp);
        temp = removePrefixes(temp);
        
        return temp.trim();
    }

    /**
     * Template Method - có thể override để thay đổi cách remove diacritics
     */
    protected String removeDiacritics(String str) {
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        return DIACRITICAL_MARKS.matcher(normalized).replaceAll("");
    }

    /**
     * Template Method - có thể override để thêm special chars khác
     */
    protected String removeVietnameseSpecialChars(String str) {
        return str.replace("đ", "d");
    }

    /**
     * Template Method - có thể override để thêm prefixes khác
     */
    protected String removePrefixes(String str) {
        return str
                .replace("thanh pho", "")
                .replace("tinh", "")
                .replace("tp.", "");
    }
}
