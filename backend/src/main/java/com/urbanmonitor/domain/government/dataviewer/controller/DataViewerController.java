package com.urbanmonitor.domain.government.dataviewer.controller;

import com.urbanmonitor.domain.government.dataviewer.dto.TableDataResponse;
import com.urbanmonitor.domain.government.dataviewer.service.DataViewerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data-viewer")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Data Viewer", description = "API để xem tất cả dữ liệu từ database")
public class DataViewerController {

    private final DataViewerService dataViewerService;

    /**
     * Lấy danh sách tất cả các bảng trong database
     */
    @GetMapping("/tables")
    @Operation(summary = "Lấy danh sách tất cả tables/entities")
    public ResponseEntity<List<Map<String, String>>> getAllTables() {
        log.info("Getting all tables");
        List<Map<String, String>> tables = dataViewerService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    /**
     * Lấy dữ liệu của một bảng cụ thể
     */
    @GetMapping("/tables/{entityName}")
    @Operation(summary = "Lấy dữ liệu của một table/entity")
    public ResponseEntity<TableDataResponse> getTableData(
            @PathVariable @Parameter(description = "Tên entity") String entityName,
            @RequestParam(defaultValue = "0") @Parameter(description = "Số trang (bắt đầu từ 0)") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Số record mỗi trang") int pageSize) {
        
        log.info("Getting data for entity: {}, page: {}, pageSize: {}", entityName, page, pageSize);
        TableDataResponse response = dataViewerService.getTableData(entityName, page, pageSize);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm dữ liệu trong một bảng
     */
    @GetMapping("/tables/{entityName}/search")
    @Operation(summary = "Tìm kiếm dữ liệu trong một table/entity")
    public ResponseEntity<TableDataResponse> searchTableData(
            @PathVariable @Parameter(description = "Tên entity") String entityName,
            @RequestParam @Parameter(description = "Từ khóa tìm kiếm") String q,
            @RequestParam(defaultValue = "0") @Parameter(description = "Số trang") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Số record mỗi trang") int pageSize) {
        
        log.info("Searching in entity: {}, query: {}", entityName, q);
        TableDataResponse response = dataViewerService.searchTableData(entityName, q, page, pageSize);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin schema của một bảng (chỉ columns, không có data)
     */
    @GetMapping("/tables/{entityName}/schema")
    @Operation(summary = "Lấy schema/columns của một table")
    public ResponseEntity<TableDataResponse> getTableSchema(
            @PathVariable @Parameter(description = "Tên entity") String entityName) {
        
        log.info("Getting schema for entity: {}", entityName);
        TableDataResponse response = dataViewerService.getTableData(entityName, 0, 0);
        response.setData(null); // Chỉ trả về columns
        return ResponseEntity.ok(response);
    }
}
