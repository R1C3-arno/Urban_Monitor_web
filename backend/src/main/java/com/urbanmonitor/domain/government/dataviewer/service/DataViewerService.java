package com.urbanmonitor.domain.government.dataviewer.service;

import com.urbanmonitor.domain.government.dataviewer.dto.TableDataResponse;
import com.urbanmonitor.domain.government.dataviewer.dto.TableDataResponse.ColumnInfo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.metamodel.EntityType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DataViewerService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Lấy danh sách tất cả các bảng/entity trong database
     */
    public List<Map<String, String>> getAllTables() {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        
        return entities.stream()
                .map(entity -> {
                    Map<String, String> tableInfo = new HashMap<>();
                    tableInfo.put("entityName", entity.getName());
                    tableInfo.put("javaType", entity.getJavaType().getSimpleName());
                    
                    // Lấy table name từ @Table annotation
                    jakarta.persistence.Table tableAnnotation = 
                        entity.getJavaType().getAnnotation(jakarta.persistence.Table.class);
                    String tableName = tableAnnotation != null ? tableAnnotation.name() : entity.getName().toLowerCase();
                    tableInfo.put("tableName", tableName);
                    
                    return tableInfo;
                })
                .sorted(Comparator.comparing(m -> m.get("tableName")))
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết của một entity (columns + data)
     */
    public TableDataResponse getTableData(String entityName, int page, int pageSize) {
        // Tìm entity class
        EntityType<?> entityType = entityManager.getMetamodel().getEntities().stream()
                .filter(e -> e.getName().equalsIgnoreCase(entityName) || 
                            e.getJavaType().getSimpleName().equalsIgnoreCase(entityName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Entity not found: " + entityName));
        
        Class<?> entityClass = entityType.getJavaType();
        
        // Lấy table name
        jakarta.persistence.Table tableAnnotation = entityClass.getAnnotation(jakarta.persistence.Table.class);
        String tableName = tableAnnotation != null ? tableAnnotation.name() : entityName.toLowerCase();
        
        // Lấy thông tin columns
        List<ColumnInfo> columns = getColumnInfo(entityClass);
        
        // Count total records
        String countQuery = "SELECT COUNT(e) FROM " + entityType.getName() + " e";
        Long totalRecords = (Long) entityManager.createQuery(countQuery).getSingleResult();
        
        // Fetch data with pagination
        String dataQuery = "SELECT e FROM " + entityType.getName() + " e";
        List<?> results = entityManager.createQuery(dataQuery)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();
        
        // Convert entities to Map
        List<Map<String, Object>> data = results.stream()
                .map(entity -> entityToMap(entity, columns))
                .collect(Collectors.toList());
        
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);
        
        return TableDataResponse.builder()
                .tableName(tableName)
                .entityName(entityType.getName())
                .columns(columns)
                .data(data)
                .totalRecords(totalRecords)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    /**
     * Lấy thông tin columns của entity
     */
    private List<ColumnInfo> getColumnInfo(Class<?> entityClass) {
        List<ColumnInfo> columns = new ArrayList<>();
        
        for (Field field : getAllFields(entityClass)) {
            field.setAccessible(true);
            
            // Skip các field có @Transient hoặc các collection
            if (field.isAnnotationPresent(jakarta.persistence.Transient.class)) {
                continue;
            }
            if (Collection.class.isAssignableFrom(field.getType())) {
                continue;
            }
            
            boolean isPrimaryKey = field.isAnnotationPresent(jakarta.persistence.Id.class);
            boolean isNullable = true;
            
            jakarta.persistence.Column colAnnotation = field.getAnnotation(jakarta.persistence.Column.class);
            if (colAnnotation != null) {
                isNullable = colAnnotation.nullable();
            }
            
            columns.add(ColumnInfo.builder()
                    .name(field.getName())
                    .type(getSimpleTypeName(field.getType()))
                    .nullable(isNullable)
                    .primaryKey(isPrimaryKey)
                    .build());
        }
        
        return columns;
    }

    /**
     * Lấy tất cả fields bao gồm cả từ parent class
     */
    private List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        while (clazz != null && clazz != Object.class) {
            fields.addAll(Arrays.asList(clazz.getDeclaredFields()));
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

    /**
     * Convert entity sang Map
     */
    private Map<String, Object> entityToMap(Object entity, List<ColumnInfo> columns) {
        Map<String, Object> map = new LinkedHashMap<>();
        
        for (ColumnInfo column : columns) {
            try {
                Field field = getFieldFromClass(entity.getClass(), column.getName());
                if (field != null) {
                    field.setAccessible(true);
                    Object value = field.get(entity);
                    map.put(column.getName(), value);
                }
            } catch (Exception e) {
                log.warn("Error reading field {}: {}", column.getName(), e.getMessage());
                map.put(column.getName(), null);
            }
        }
        
        return map;
    }

    /**
     * Tìm field trong class hoặc parent class
     */
    private Field getFieldFromClass(Class<?> clazz, String fieldName) {
        while (clazz != null && clazz != Object.class) {
            try {
                return clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        return null;
    }

    /**
     * Lấy tên type đơn giản
     */
    private String getSimpleTypeName(Class<?> type) {
        if (type.isEnum()) {
            return "ENUM";
        }
        return type.getSimpleName();
    }

    /**
     * Tìm kiếm data trong một entity
     */
    public TableDataResponse searchTableData(String entityName, String searchTerm, int page, int pageSize) {
        EntityType<?> entityType = entityManager.getMetamodel().getEntities().stream()
                .filter(e -> e.getName().equalsIgnoreCase(entityName) || 
                            e.getJavaType().getSimpleName().equalsIgnoreCase(entityName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Entity not found: " + entityName));
        
        Class<?> entityClass = entityType.getJavaType();
        List<ColumnInfo> columns = getColumnInfo(entityClass);
        
        // Build dynamic search query
        StringBuilder queryBuilder = new StringBuilder("SELECT e FROM " + entityType.getName() + " e WHERE ");
        List<String> conditions = new ArrayList<>();
        
        for (ColumnInfo col : columns) {
            if (col.getType().equals("String")) {
                conditions.add("LOWER(CAST(e." + col.getName() + " AS string)) LIKE LOWER(:searchTerm)");
            }
        }
        
        if (conditions.isEmpty()) {
            return getTableData(entityName, page, pageSize);
        }
        
        queryBuilder.append(String.join(" OR ", conditions));
        
        String searchPattern = "%" + searchTerm + "%";
        
        // Count
        String countQuery = "SELECT COUNT(e) FROM " + entityType.getName() + " e WHERE " + 
                           String.join(" OR ", conditions);
        Long totalRecords = (Long) entityManager.createQuery(countQuery)
                .setParameter("searchTerm", searchPattern)
                .getSingleResult();
        
        // Data
        List<?> results = entityManager.createQuery(queryBuilder.toString())
                .setParameter("searchTerm", searchPattern)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();
        
        List<Map<String, Object>> data = results.stream()
                .map(entity -> entityToMap(entity, columns))
                .collect(Collectors.toList());
        
        jakarta.persistence.Table tableAnnotation = entityClass.getAnnotation(jakarta.persistence.Table.class);
        String tableName = tableAnnotation != null ? tableAnnotation.name() : entityName.toLowerCase();
        
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);
        
        return TableDataResponse.builder()
                .tableName(tableName)
                .entityName(entityType.getName())
                .columns(columns)
                .data(data)
                .totalRecords(totalRecords)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }
}
