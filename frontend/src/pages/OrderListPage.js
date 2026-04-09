import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function OrderListPage({ member, onLogout }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders', { params: { page: 0, size: 20 } });
            setOrders(res.data.data.content || []);
        } catch (err) { setOrders([]); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleCancel = async (orderId) => {
        if (!window.confirm('주문을 취소하시겠습니까?')) return;
        try {
            await api.post(`/orders/${orderId}/cancel`);
            alert('주문이 취소되었습니다.');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || '취소 실패');
        }
    };

    const statusLabel = (status) => {
        const map = {
            PENDING: '입금대기',
            PAID: '입금확인',
            SHIPPING: '배송중',
            DELIVERED: '배송완료',
            CANCELLED: '취소됨',
        };
        return map[status] || status;
    };

    const canCancel = (status) => status === 'PENDING' || status === 'PAID';

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <h2 style={styles.title}>ORDERS</h2>

                {orders.length === 0 ? (
                    <div style={styles.empty}>
                        <p>No orders yet.</p>
                        <button style={styles.shopBtn} onClick={() => navigate('/')}>START SHOPPING</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div>
                                    <p style={styles.orderNo}>{order.orderNumber}</p>
                                    <p style={styles.orderDate}>{new Date(order.orderedAt).toLocaleDateString()}</p>
                                </div>
                                <div style={styles.headerRight}>
                  <span style={{
                      ...styles.statusBadge,
                      background: order.status === 'CANCELLED' ? '#fee' : '#f5f5f5',
                      color: order.status === 'CANCELLED' ? '#c00' : '#555',
                  }}>{statusLabel(order.status)}</span>
                                </div>
                            </div>

                            {order.orderProducts && order.orderProducts.map(op => (
                                <div key={op.id} style={styles.productRow}>
                                    <div>
                                        <p style={styles.productName}>{op.productName}</p>
                                        <p style={styles.productSku}>{op.sku} · Qty: {op.quantity}</p>
                                    </div>
                                    <p style={styles.productPrice}>KRW {Number(op.unitPrice * op.quantity).toLocaleString()}</p>
                                </div>
                            ))}

                            <div style={styles.orderFooter}>
                                <span style={styles.orderAmount}>KRW {Number(order.totalAmount).toLocaleString()}</span>
                                {canCancel(order.status) && (
                                    <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>주문 취소</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '800px', margin: '0 auto', padding: '40px 40px 80px' },
    title: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', marginBottom: '40px' },
    empty: { textAlign: 'center', padding: '80px 0', color: '#999', fontSize: '14px' },
    shopBtn: { marginTop: '20px', padding: '14px 32px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' },
    orderCard: { borderBottom: '1px solid #eee', padding: '24px 0' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    orderNo: { fontSize: '14px', fontWeight: 500, marginBottom: '4px' },
    orderDate: { fontSize: '12px', color: '#999' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    statusBadge: { fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', padding: '4px 12px' },
    productRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' },
    productName: { fontSize: '13px', fontWeight: 500 },
    productSku: { fontSize: '12px', color: '#999', marginTop: '2px' },
    productPrice: { fontSize: '13px', fontWeight: 500 },
    orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' },
    orderAmount: { fontSize: '15px', fontWeight: 500 },
    cancelBtn: { padding: '8px 16px', background: '#fff', border: '1px solid #ddd', fontSize: '12px', cursor: 'pointer', color: '#666' },
};