package com.urbanmonitor.domain.government.dataviewer.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableDataResponse {
    
    private String tableName;
    private String entityName;
    private List<ColumnInfo> columns;
    private List<Map<String, Object>> data;
    private long totalRecords;
    private int page;
    private int pageSize;
    private int totalPages;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ColumnInfo {
        private String name;
        private String type;
        private boolean nullable;
        private boolean primaryKey;
    }
}
