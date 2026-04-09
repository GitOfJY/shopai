import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import AdminNav from '../../components/AdminNav';

export default function AdminOrderListPage({ member, onLogout }) {
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders/admin', { params: { page: 0, size: 50 } });
            setOrders(res.data.data.content || []);
        } catch (err) { setOrders([]); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || '상태 변경 실패'); }
    };

    const statusLabel = (status) => {
        const map = { PENDING: '입금대기', PAID: '입금확인', SHIPPING: '배송중', DELIVERED: '배송완료', CANCELLED: '취소됨' };
        return map[status] || status;
    };

    const statusColor = (status) => {
        const map = { PENDING: '#f59e0b', PAID: '#3b82f6', SHIPPING: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444' };
        return map[status] || '#999';
    };

    const nextAction = (status) => {
        const map = {
            PENDING: { status: 'PAID', label: '입금확인' },
            PAID: { status: 'SHIPPING', label: '발송처리' },
            SHIPPING: { status: 'DELIVERED', label: '배송완료' },
        };
        return map[status] || null;
    };

    return (
        <div style={styles.container}>
            <AdminNav member={member} onLogout={onLogout} />
            <main style={styles.main}>
                <h2 style={styles.title}>주문 관리</h2>

                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>주문번호</th>
                        <th style={styles.th}>주문일</th>
                        <th style={styles.th}>상품</th>
                        <th style={styles.th}>금액</th>
                        <th style={styles.th}>배송지</th>
                        <th style={styles.th}>상태</th>
                        <th style={styles.th}>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={styles.tr}>
                            <td style={styles.td}><span style={styles.orderNo}>{order.orderNumber}</span></td>
                            <td style={styles.td}>{new Date(order.orderedAt).toLocaleDateString()}</td>
                            <td style={styles.td}>
                                {order.orderProducts?.map(op => (
                                    <div key={op.id} style={styles.productLine}>{op.productName} ({op.sku}) x{op.quantity}</div>
                                ))}
                            </td>
                            <td style={styles.td}>₩{Number(order.totalAmount).toLocaleString()}</td>
                            <td style={styles.td}>
                                <div style={styles.address}>{order.recipientName}</div>
                                <div style={styles.addressDetail}>{order.shippingAddress}</div>
                            </td>
                            <td style={styles.td}>
                  <span style={{ ...styles.badge, background: statusColor(order.status) + '18', color: statusColor(order.status) }}>
                    {statusLabel(order.status)}
                  </span>
                            </td>
                            <td style={styles.td}>
                                {nextAction(order.status) && (
                                    <button style={styles.actionBtn} onClick={() => handleStatusChange(order.id, nextAction(order.status).status)}>
                                        {nextAction(order.status).label}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {orders.length === 0 && <p style={styles.empty}>주문이 없습니다.</p>}
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f8f8f8' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
    title: { fontSize: '18px', fontWeight: 600, marginBottom: '24px', color: '#111' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#666', borderBottom: '1px solid #eee' },
    tr: { borderBottom: '1px solid #f5f5f5' },
    td: { padding: '14px 16px', fontSize: '13px', color: '#333', verticalAlign: 'top' },
    orderNo: { fontWeight: 500, fontSize: '12px', fontFamily: 'monospace' },
    productLine: { fontSize: '12px', color: '#555', marginBottom: '2px' },
    address: { fontSize: '13px', fontWeight: 500 },
    addressDetail: { fontSize: '12px', color: '#888', marginTop: '2px' },
    badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-block' },
    actionBtn: { padding: '6px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#999', padding: '60px 0' },
};