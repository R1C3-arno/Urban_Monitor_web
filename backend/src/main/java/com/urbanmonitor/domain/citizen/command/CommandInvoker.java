package com.urbanmonitor.domain.citizen.command;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Stack;

/**
 * COMMAND INVOKER
 *
 * Design Pattern: Command Pattern
 * ===============================
 * Manages command execution and history
 *
 * DSA Applied:
 * ===========
 * - Stack for undo/redo (LIFO)
 * - O(1) push/pop operations
 *
 * Features:
 * ========
 * - Execute commands
 * - Undo last action
 * - Redo undone action
 * - View command history
 *
 * Usage:
 * =====
 * invoker.execute(new ApproveReportCommand(...));
 * invoker.undo(); // Revert last action
 * invoker.redo(); // Re-apply undone action
 */
@Slf4j
@Component
public class CommandInvoker {

    // DSA: Stack for undo/redo
    private final Stack<AdminCommand> undoStack = new Stack<>();
    private final Stack<AdminCommand> redoStack = new Stack<>();

    private static final int MAX_HISTORY = 50; // Limit history size

    /**
     * Execute a command and add to history
     *
     * @param command Command to execute
     */
    public void execute(AdminCommand command) {
        log.info("🎬 Invoker executing: {}", command.getDescription());

        try {
            command.execute();

            // Add to undo stack
            undoStack.push(command);

            // Clear redo stack (new action invalidates redo history)
            redoStack.clear();

            // Trim history if too large
            trimHistoryIfNeeded();

            log.info("✅ Command executed and added to history (undo stack size: {})",
                    undoStack.size());

        } catch (Exception e) {
            log.error("❌ Command execution failed: {}", command.getDescription(), e);
            throw e;
        }
    }

    /**
     * Undo last command
     *
     * @return true if undo successful, false if nothing to undo
     */
    public boolean undo() {
        if (undoStack.isEmpty()) {
            log.warn("⚠️ Cannot undo: No commands in history");
            return false;
        }

        AdminCommand command = undoStack.pop();

        log.info("◀️ Invoker undoing: {}", command.getDescription());

        try {
            command.undo();

            // Add to redo stack
            redoStack.push(command);

            log.info("✅ Command undone (redo stack size: {})", redoStack.size());
            return true;

        } catch (Exception e) {
            log.error("❌ Undo failed: {}", command.getDescription(), e);
            // Put command back on undo stack
            undoStack.push(command);
            throw e;
        }
    }

    /**
     * Redo last undone command
     *
     * @return true if redo successful, false if nothing to redo
     */
    public boolean redo() {
        if (redoStack.isEmpty()) {
            log.warn("⚠️ Cannot redo: No commands in redo history");
            return false;
        }

        AdminCommand command = redoStack.pop();

        log.info("▶️ Invoker redoing: {}", command.getDescription());

        try {
            command.execute();

            // Add back to undo stack
            undoStack.push(command);

            log.info("✅ Command redone (undo stack size: {})", undoStack.size());
            return true;

        } catch (Exception e) {
            log.error("❌ Redo failed: {}", command.getDescription(), e);
            // Put command back on redo stack
            redoStack.push(command);
            throw e;
        }
    }

    /**
     * Check if undo is available
     */
    public boolean canUndo() {
        return !undoStack.isEmpty();
    }

    /**
     * Check if redo is available
     */
    public boolean canRedo() {
        return !redoStack.isEmpty();
    }

    /**
     * Get undo stack size
     */
    public int getUndoStackSize() {
        return undoStack.size();
    }

    /**
     * Get redo stack size
     */
    public int getRedoStackSize() {
        return redoStack.size();
    }

    /**
     * Get command history (for UI display)
     */
    public java.util.List<String> getCommandHistory() {
        return undoStack.stream()
                .map(AdminCommand::getDescription)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Clear all history
     */
    public void clearHistory() {
        undoStack.clear();
        redoStack.clear();
        log.info("🧹 Command history cleared");
    }

    /**
     * Trim history if exceeds max size
     */
    private void trimHistoryIfNeeded() {
        while (undoStack.size() > MAX_HISTORY) {
            undoStack.remove(0); // Remove oldest
            log.debug("🗑️ Trimmed oldest command from history");
        }
    }

    /**
     * Get invoker status
     */
    public InvokerStatus getStatus() {
        return InvokerStatus.builder()
                .undoStackSize(undoStack.size())
                .redoStackSize(redoStack.size())
                .canUndo(canUndo())
                .canRedo(canRedo())
                .recentCommands(getCommandHistory())
                .build();
    }

    /**
     * Status DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class InvokerStatus {
        private int undoStackSize;
        private int redoStackSize;
        private boolean canUndo;
        private boolean canRedo;
        private java.util.List<String> recentCommands;
    }
}