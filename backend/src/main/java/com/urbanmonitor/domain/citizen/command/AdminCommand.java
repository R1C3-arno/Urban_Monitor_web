package com.urbanmonitor.domain.citizen.command;

import java.time.LocalDateTime;

/**
 * COMMAND PATTERN - Admin Actions
 *
 * Design Pattern: Command
 * =======================
 * Encapsulates admin actions as objects
 * Enables undo/redo functionality
 *
 * SOLID: Single Responsibility
 * Each command handles one specific action
 *
 * Benefits:
 * ========
 * - Undo/Redo support
 * - Action history tracking
 * - Audit logging
 * - Macro commands (batch operations)
 *
 * Usage:
 * =====
 * AdminCommand cmd = new ApproveReportCommand(service, reportId, "Admin");
 * cmd.execute();  // Approve
 * cmd.undo();     // Revert to pending
 */
public interface AdminCommand {

    /**
     * Execute the command
     * @throws RuntimeException if execution fails
     */
    void execute();

    /**
     * Undo the command (revert changes)
     * @throws RuntimeException if undo fails
     */
    void undo();

    /**
     * Get human-readable description
     * For audit log and UI display
     */
    String getDescription();

    /**
     * Get command ID (unique identifier)
     */
    String getCommandId();

    /**
     * Get execution timestamp
     */
    LocalDateTime getExecutedAt();

    /**
     * Check if command can be undone
     */
    default boolean canUndo() {
        return true;
    }

    /**
     * Check if command was executed
     */
    boolean isExecuted();
}