import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/data-viewer';

const styles = {
    container: {
        padding: '30px',
        background: '#0a0a0a',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 700,
        background: 'linear-gradient(90deg, #fff, #888)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    select: {
        padding: '12px 20px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
        minWidth: '250px',
        outline: 'none',
    },
    statsRow: {
        display: 'flex',
        gap: '15px',
        marginBottom: '25px',
    },
    statCard: {
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '20px 25px',
        minWidth: '140px',
    },
    statLabel: {
        fontSize: '12px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#fff',
        marginTop: '5px',
    },
    tableWrapper: {
        background: '#111',
        borderRadius: '16px',
        border: '1px solid #222',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '16px 20px',
        textAlign: 'left',
        background: '#1a1a1a',
        color: '#888',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #222',
    },
    td: {
        padding: '14px 20px',
        borderBottom: '1px solid #1a1a1a',
        fontSize: '14px',
        color: '#ccc',
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    tr: {
        transition: 'background 0.2s',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#0f0f0f',
        borderTop: '1px solid #222',
    },
    pageInfo: {
        fontSize: '13px',
        color: '#666',
    },
    pageButtons: {
        display: 'flex',
        gap: '8px',
    },
    btn: {
        padding: '10px 18px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    btnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
    loading: {
        textAlign: 'center',
        padding: '60px',
        color: '#666',
        fontSize: '14px',
    },
    empty: {
        textAlign: 'center',
        padding: '80px',
        color: '#444',
    },
    badge: {
        fontSize: '10px',
        padding: '3px 8px',
        borderRadius: '4px',
        marginLeft: '8px',
        fontWeight: 500,
    },
    typeBadge: {
        background: '#222',
        color: '#666',
    },
    pkBadge: {
        background: '#2a2a00',
        color: '#ffd700',
    },
    nullValue: {
        color: '#444',
        fontStyle: 'italic',
    },
};

export default function DataViewerPage() {
    const [tables, setTables] = useState([]);
    const [selected, setSelected] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        axios.get(`${API_BASE}/tables`).then(res => setTables(res.data));
    }, []);

    useEffect(() => {
        if (selected) {
            setLoading(true);
            axios.get(`${API_BASE}/tables/${selected}?page=${page}&pageSize=20`)
                .then(res => setData(res.data))
                .finally(() => setLoading(false));
        }
    }, [selected, page]);

    const formatValue = (val) => {
        if (val === null || val === undefined) return <span style={styles.nullValue}>NULL</span>;
        if (typeof val === 'object') return JSON.stringify(val);
        if (typeof val === 'boolean') return val ? '✓' : '✗';
        return String(val);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📊 Data Viewer</h1>
                <select
                    value={selected}
                    onChange={e => { setSelected(e.target.value); setPage(0); setData(null); }}
                    style={styles.select}
                >
                    <option value="">-- Chọn bảng --</option>
                    {tables.map(t => (
                        <option key={t.entityName} value={t.entityName}>
                            {t.tableName}
                        </option>
                    ))}
                </select>
            </div>

            {!selected && (
                <div style={styles.empty}>
                    <p style={{ fontSize: '48px', marginBottom: '20px' }}>🗄️</p>
                    <p>Chọn một bảng để xem dữ liệu</p>
                </div>
            )}

            {loading && <div style={styles.loading}>⏳ Đang tải dữ liệu...</div>}

            {data && !loading && (
                <>
                    <div style={styles.statsRow}>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Tổng bản ghi</div>
                            <div style={styles.statValue}>{data.totalRecords.toLocaleString()}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Số cột</div>
                            <div style={styles.statValue}>{data.columns?.length || 0}</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Trang hiện tại</div>
                            <div style={styles.statValue}>{page + 1} / {data.totalPages || 1}</div>
                        </div>
                    </div>

                    <div style={styles.tableWrapper}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    {data.columns?.map(col => (
                                        <th key={col.name} style={styles.th}>
                                            {col.name}
                                            {col.primaryKey && <span style={{...styles.badge, ...styles.pkBadge}}>PK</span>}
                                            <span style={{...styles.badge, ...styles.typeBadge}}>{col.type}</span>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {data.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={data.columns?.length} style={{...styles.td, textAlign: 'center', padding: '40px'}}>
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    data.data?.map((row, i) => (
                                        <tr key={i} style={styles.tr} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            {data.columns.map(col => (
                                                <td key={col.name} style={styles.td} title={String(row[col.name] ?? '')}>
                                                    {formatValue(row[col.name])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        {data.totalPages > 1 && (
                            <div style={styles.pagination}>
                <span style={styles.pageInfo}>
                  Hiển thị {page * 20 + 1} - {Math.min((page + 1) * 20, data.totalRecords)} / {data.totalRecords} bản ghi
                </span>
                                <div style={styles.pageButtons}>
                                    <button
                                        style={{...styles.btn, ...(page === 0 ? styles.btnDisabled : {})}}
                                        disabled={page === 0}
                                        onClick={() => setPage(0)}
                                    >⟪ Đầu</button>
                                    <button
                                        style={{...styles.btn, ...(page === 0 ? styles.btnDisabled : {})}}
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                    >← Trước</button>
                                    <button
                                        style={{...styles.btn, ...(page >= data.totalPages - 1 ? styles.btnDisabled : {})}}
                                        disabled={page >= data.totalPages - 1}
                                        onClick={() => setPage(p => p + 1)}
                                    >Sau →</button>
                                    <button
                                        style={{...styles.btn, ...(page >= data.totalPages - 1 ? styles.btnDisabled : {})}}
                                        disabled={page >= data.totalPages - 1}
                                        onClick={() => setPage(data.totalPages - 1)}
                                    >Cuối ⟫</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}