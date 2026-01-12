package com.urbanmonitor.domain.citizen.temperaturemonitor.normalizer;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * chuẩn hóa tiếng viêtk
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
     * remove diacritics
     */
    protected String removeDiacritics(String str) {
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        return DIACRITICAL_MARKS.matcher(normalized).replaceAll("");
    }

    /**
     *  special chars
     */
    protected String removeVietnameseSpecialChars(String str) {
        return str.replace("đ", "d");
    }

    /**
     * prefixes
     */
    protected String removePrefixes(String str) {
        return str
                .replace("thanh pho", "")
                .replace("tinh", "")
                .replace("tp.", "");
    }
}
