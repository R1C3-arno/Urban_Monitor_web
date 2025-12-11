package com.urbanmonitor.domain.citizen.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * COMMAND HISTORY - Audit Log
 *
 * Tracks all executed commands for:
 * - Audit trail
 * - Compliance
 * - Debugging
 * - User activity monitoring
 *
 * DSA Applied:
 * ===========
 * - ArrayList for sequential access
 * - O(1) append operations
 *
 * Usage:
 * =====
 * commandHistory.record(command, "SUCCESS");
 * List<HistoryEntry> recent = commandHistory.getRecentHistory(10);
 */
@Slf4j
@Component
public class CommandHistory {

    private final List<HistoryEntry> history = new ArrayList<>();
    private static final int MAX_HISTORY = 1000;

    /**
     * Record command execution
     */
    public void record(AdminCommand command, String status) {
        HistoryEntry entry = HistoryEntry.builder()
                .commandId(command.getCommandId())
                .description(command.getDescription())
                .executedAt(command.getExecutedAt())
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();

        synchronized (history) {
            history.add(entry);

            // Trim if too large
            if (history.size() > MAX_HISTORY) {
                history.remove(0);
            }
        }

        log.debug("📝 Recorded command: {} - {}", command.getCommandId(), status);
    }

    /**
     * Record successful execution
     */
    public void recordSuccess(AdminCommand command) {
        record(command, "SUCCESS");
    }

    /**
     * Record failed execution
     */
    public void recordFailure(AdminCommand command, String error) {
        HistoryEntry entry = HistoryEntry.builder()
                .commandId(command.getCommandId())
                .description(command.getDescription())
                .executedAt(command.getExecutedAt())
                .status("FAILED")
                .error(error)
                .timestamp(LocalDateTime.now())
                .build();

        synchronized (history) {
            history.add(entry);
        }

        log.warn("⚠️ Recorded failure: {} - {}", command.getCommandId(), error);
    }

    /**
     * Get recent history
     */
    public List<HistoryEntry> getRecentHistory(int limit) {
        synchronized (history) {
            int size = history.size();
            int fromIndex = Math.max(0, size - limit);
            return new ArrayList<>(history.subList(fromIndex, size));
        }
    }

    /**
     * Get all history
     */
    public List<HistoryEntry> getAllHistory() {
        synchronized (history) {
            return new ArrayList<>(history);
        }
    }

    /**
     * Get history by status
     */
    public List<HistoryEntry> getHistoryByStatus(String status) {
        synchronized (history) {
            return history.stream()
                    .filter(entry -> entry.getStatus().equals(status))
                    .collect(Collectors.toList());
        }
    }

    /**
     * Get history within time range
     */
    public List<HistoryEntry> getHistoryInRange(LocalDateTime start, LocalDateTime end) {
        synchronized (history) {
            return history.stream()
                    .filter(entry -> {
                        LocalDateTime t = entry.getTimestamp();
                        return !t.isBefore(start) && !t.isAfter(end);
                    })
                    .collect(Collectors.toList());
        }
    }

    /**
     * Clear history
     */
    public void clear() {
        synchronized (history) {
            history.clear();
        }
        log.info("🧹 Command history cleared");
    }

    /**
     * Get history size
     */
    public int size() {
        synchronized (history) {
            return history.size();
        }
    }

    /**
     * History entry DTO
     */
    @Data
    @Builder
    @AllArgsConstructor
    public static class HistoryEntry {
        private String commandId;
        private String description;
        private LocalDateTime executedAt;
        private String status; // SUCCESS, FAILED, UNDONE
        private String error;
        private LocalDateTime timestamp;
    }
}