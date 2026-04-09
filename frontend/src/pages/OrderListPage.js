import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function OrderListPage({ member, onLogout }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data.content || []);
        } catch (err) { setOrders([]); }
    };

    const statusLabel = (status) => {
        const map = { PENDING: 'Order Placed', PAID: 'Paid', SHIPPING: 'Shipping', DELIVERED: 'Delivered', CANCELLED: 'Cancelled', RETURNED: 'Returned' };
        return map[status] || status;
    };

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
                            <div style={styles.orderTop}>
                                <div>
                                    <p style={styles.orderNo}>{order.orderNumber}</p>
                                    <p style={styles.orderDate}>{new Date(order.orderedAt).toLocaleDateString()}</p>
                                </div>
                                <div style={styles.statusBadge}>{statusLabel(order.status)}</div>
                            </div>
                            <div style={styles.orderBottom}>
                                <span style={styles.orderAmount}>KRW {Number(order.totalAmount).toLocaleString()}</span>
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
    orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
    orderNo: { fontSize: '14px', fontWeight: 500, marginBottom: '4px' },
    orderDate: { fontSize: '12px', color: '#999' },
    statusBadge: { fontSize: '12px', fontWeight: 500, letterSpacing: '0.5px', padding: '4px 12px', background: '#f5f5f5', color: '#333' },
    orderBottom: { display: 'flex', justifyContent: 'flex-end' },
    orderAmount: { fontSize: '15px', fontWeight: 500 },
};