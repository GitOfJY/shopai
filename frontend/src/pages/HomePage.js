import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AdminNav from '../components/AdminNav';

export default function HomePage({ member, onLogout }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0 });

    const fetchStats = useCallback(async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products', { params: { page: 0, size: 1 } }),
                api.get('/orders/admin', { params: { page: 0, size: 100 } }),
            ]);
            const orders = orderRes.data.data.content || [];
            setStats({
                products: prodRes.data.data.totalElements || 0,
                orders: orders.length,
                pending: orders.filter(o => o.status === 'PENDING').length,
            });
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const cards = [
        { title: '전체 상품', value: stats.products, unit: '개', path: '/admin/products', color: '#3b82f6' },
        { title: '전체 주문', value: stats.orders, unit: '건', path: '/admin/orders', color: '#10b981' },
        { title: '입금대기', value: stats.pending, unit: '건', path: '/admin/orders', color: '#f59e0b' },
    ];

    const shortcuts = [
        { title: '상품 관리', desc: '상품 등록, 수정, 삭제', path: '/admin/products' },
        { title: '주문 관리', desc: '주문 상태 변경, 조회', path: '/admin/orders' },
        { title: '재고 관리', desc: '입출고 이력, 재고 현황', path: '/admin/inventory' },
        { title: '정산', desc: '매출 집계, 정산 리포트', path: '/admin/settlements' },
        { title: 'AI 분석', desc: '재고 분석, 이상 탐지', path: '/admin/ai' },
    ];

    return (
        <div style={styles.container}>
            <AdminNav member={member} onLogout={onLogout} />
            <main style={styles.main}>
                <h2 style={styles.greeting}>Dashboard</h2>

                <div style={styles.statsGrid}>
                    {cards.map(card => (
                        <div key={card.title} style={styles.statCard} onClick={() => navigate(card.path)}>
                            <p style={styles.statTitle}>{card.title}</p>
                            <p style={{ ...styles.statValue, color: card.color }}>{card.value}<span style={styles.statUnit}>{card.unit}</span></p>
                        </div>
                    ))}
                </div>

                <h3 style={styles.sectionTitle}>Quick Access</h3>
                <div style={styles.shortcutGrid}>
                    {shortcuts.map(s => (
                        <div key={s.path} style={styles.shortcutCard} onClick={() => navigate(s.path)}>
                            <h4 style={styles.shortcutTitle}>{s.title}</h4>
                            <p style={styles.shortcutDesc}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f8f8f8' },
    main: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
    greeting: { fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#111' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
    statCard: { background: '#fff', padding: '24px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    statTitle: { fontSize: '13px', color: '#888', marginBottom: '8px' },
    statValue: { fontSize: '32px', fontWeight: 700 },
    statUnit: { fontSize: '14px', fontWeight: 400, color: '#999', marginLeft: '4px' },
    sectionTitle: { fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '16px', letterSpacing: '0.5px' },
    shortcutGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
    shortcutCard: { background: '#fff', padding: '20px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' },
    shortcutTitle: { fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#111' },
    shortcutDesc: { fontSize: '12px', color: '#999' },
};