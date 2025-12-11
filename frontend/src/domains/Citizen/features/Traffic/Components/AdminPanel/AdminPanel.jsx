import React, { useState, useEffect } from 'react';
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";

/**
 * AdminPanel Component
 * Shows Design Patterns in action:
 *
 * ✅ Command Pattern: Approve/Reject with Undo/Redo
 * ✅ State Pattern: Report states (Pending → Approved/Rejected)
 * ✅ Chain of Responsibility: Validation chain
 * ✅ Observer Pattern: Real-time notifications
 */
export const AdminPanel = () => {
    const [pendingReports, setPendingReports] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    /**
     * Load pending reports
     */
    const loadPendingReports = async () => {
        try {
            setLoading(true);
            const reports = await DSAService.getPendingReports();
            setPendingReports(reports);
            console.log('✅ Loaded', reports.length, 'pending reports');
        } catch (err) {
            console.error('❌ Failed to load reports:', err);
            addNotification('Failed to load reports', 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load command history
     */
    const loadCommandHistory = async () => {
        try {
            const history = await DSAService.getCommandHistory();
            setCommandHistory(history);

            // Check if undo/redo available
            setCanUndo(history.some(cmd => !cmd.undone));
            setCanRedo(history.some(cmd => cmd.undone));
        } catch (err) {
            console.error('❌ Failed to load history:', err);
        }
    };

    /**
     * Approve report (Command Pattern)
     */
    const handleApprove = async (reportId) => {
        try {
            setLoading(true);
            await DSAService.approveReport(reportId, 'Admin');

            addNotification(`Report #${reportId} approved ✅`, 'success');

            // Reload data
            await loadPendingReports();
            await loadCommandHistory();

        } catch (err) {
            console.error('❌ Approve error:', err);
            addNotification(`Failed to approve report #${reportId}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reject report (Command Pattern)
     */
    const handleReject = async (reportId) => {
        try {
            setLoading(true);
            await DSAService.rejectReport(reportId, 'Admin');

            addNotification(`Report #${reportId} rejected ❌`, 'warning');

            // Reload data
            await loadPendingReports();
            await loadCommandHistory();

        } catch (err) {
            console.error('❌ Reject error:', err);
            addNotification(`Failed to reject report #${reportId}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Undo last command (Command Pattern)
     */
    const handleUndo = async () => {
        try {
            setLoading(true);
            await DSAService.undoLastAction();

            addNotification('Undone last action ↶', 'info');

            await loadPendingReports();
            await loadCommandHistory();

        } catch (err) {
            console.error('❌ Undo error:', err);
            addNotification('Failed to undo', 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Redo last command (Command Pattern)
     */
    const handleRedo = async () => {
        try {
            setLoading(true);
            await DSAService.redoLastAction();

            addNotification('Redone last action ↷', 'info');

            await loadPendingReports();
            await loadCommandHistory();

        } catch (err) {
            console.error('❌ Redo error:', err);
            addNotification('Failed to redo', 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Add notification (Observer Pattern simulation)
     */
    const addNotification = (message, type = 'info') => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };

        setNotifications(prev => [notification, ...prev].slice(0, 5));
    };

    /**
     * Load data on mount
     */
    useEffect(() => {
        loadPendingReports();
        loadCommandHistory();
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '400px',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 1000
        }}>
            <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
            }}>
                🔐 Admin Panel
            </h3>

            {/* Command Pattern: Undo/Redo */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px'
            }}>
                <button
                    onClick={handleUndo}
                    disabled={!canUndo || loading}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: canUndo && !loading ? '#3B82F6' : '#D1D5DB',
                        color: canUndo && !loading ? '#fff' : '#6B7280',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: canUndo && !loading ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        fontSize: '13px'
                    }}
                >
                    ↶ Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={!canRedo || loading}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: canRedo && !loading ? '#3B82F6' : '#D1D5DB',
                        color: canRedo && !loading ? '#fff' : '#6B7280',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: canRedo && !loading ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        fontSize: '13px'
                    }}
                >
                    ↷ Redo
                </button>
            </div>

            {/* Observer Pattern: Notifications */}
            {notifications.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#6B7280',
                        marginBottom: '8px'
                    }}>
                        📢 Notifications (Observer Pattern)
                    </div>
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            style={{
                                padding: '8px 12px',
                                marginBottom: '6px',
                                background:
                                    notif.type === 'success' ? '#ECFDF5' :
                                        notif.type === 'error' ? '#FEE2E2' :
                                            notif.type === 'warning' ? '#FEF3C7' : '#EFF6FF',
                                color:
                                    notif.type === 'success' ? '#065F46' :
                                        notif.type === 'error' ? '#991B1B' :
                                            notif.type === 'warning' ? '#92400E' : '#1E40AF',
                                borderRadius: '6px',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{notif.message}</span>
                            <span style={{ fontSize: '10px', opacity: 0.7 }}>
                                {notif.timestamp}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* State Pattern: Pending Reports */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#111827'
                    }}>
                        📝 Pending Reports ({pendingReports.length})
                    </div>
                    <button
                        onClick={loadPendingReports}
                        style={{
                            padding: '6px 12px',
                            background: '#F3F4F6',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                        ⏳ Loading...
                    </div>
                )}

                {!loading && pendingReports.length === 0 && (
                    <div style={{
                        padding: '20px',
                        background: '#F9FAFB',
                        borderRadius: '6px',
                        textAlign: 'center',
                        color: '#6B7280',
                        fontSize: '13px'
                    }}>
                        No pending reports
                    </div>
                )}

                {!loading && pendingReports.map(report => (
                    <div
                        key={report.id}
                        style={{
                            padding: '12px',
                            marginBottom: '10px',
                            background: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '6px'
                        }}>
                            #{report.id} - {report.title}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            marginBottom: '8px',
                            lineHeight: '1.4'
                        }}>
                            {report.description}
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '6px',
                            marginBottom: '8px'
                        }}>
                            <span style={{
                                padding: '2px 8px',
                                background: '#FEF3C7',
                                color: '#92400E',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                {report.status || 'PENDING'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                onClick={() => handleApprove(report.id)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: '#10B981',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                ✅ Approve
                            </button>
                            <button
                                onClick={() => handleReject(report.id)}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: '#EF4444',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                ❌ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Command History */}
            {commandHistory.length > 0 && (
                <div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#6B7280',
                        marginBottom: '8px'
                    }}>
                        📜 Command History (Command Pattern)
                    </div>
                    <div style={{
                        maxHeight: '200px',
                        overflow: 'auto',
                        background: '#F9FAFB',
                        padding: '10px',
                        borderRadius: '6px'
                    }}>
                        {commandHistory.map((cmd, index) => (
                            <div
                                key={index}
                                style={{
                                    fontSize: '11px',
                                    padding: '6px',
                                    marginBottom: '4px',
                                    background: cmd.undone ? '#FEE2E2' : '#fff',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span>
                                    {cmd.commandType} - Report #{cmd.reportId}
                                </span>
                                {cmd.undone && (
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#991B1B',
                                        fontWeight: '600'
                                    }}>
                                        UNDONE
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Design Patterns Legend */}
            <div style={{
                marginTop: '15px',
                padding: '12px',
                background: '#F3F4F6',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#6B7280',
                lineHeight: '1.6'
            }}>
                <strong>Design Patterns shown:</strong><br/>
                • <strong>Command</strong>: Approve/Reject with Undo/Redo<br/>
                • <strong>State</strong>: Report transitions (Pending → Approved/Rejected)<br/>
                • <strong>Observer</strong>: Real-time notifications<br/>
                • <strong>Chain</strong>: Validation chain on report submit
            </div>
        </div>
    );
};

export default AdminPanel;