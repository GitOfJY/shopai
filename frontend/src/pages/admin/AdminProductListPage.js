import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminNav from '../../components/AdminNav';

export default function AdminProductListPage({ member, onLogout }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get('/products', { params: { page: 0, size: 50 } });
            setProducts(res.data.data.content || []);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleDelete = async (id) => {
        if (!window.confirm('상품을 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) { alert(err.response?.data?.message || '삭제 실패'); }
    };

    return (
        <div style={styles.container}>
            <AdminNav member={member} onLogout={onLogout} />
            <main style={styles.main}>
                <div style={styles.header}>
                    <h2 style={styles.title}>상품 관리</h2>
                    <button style={styles.addBtn} onClick={() => navigate('/admin/products/new')}>+ 상품 등록</button>
                </div>

                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>상품명</th>
                        <th style={styles.th}>카테고리</th>
                        <th style={styles.th}>기본가</th>
                        <th style={styles.th}>상태</th>
                        <th style={styles.th}>Variants</th>
                        <th style={styles.th}>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={styles.tr}>
                            <td style={styles.td}>{p.id}</td>
                            <td style={styles.td}>{p.name}</td>
                            <td style={styles.td}>{p.category}</td>
                            <td style={styles.td}>₩{Number(p.basePrice).toLocaleString()}</td>
                            <td style={styles.td}>
                                <span style={{ ...styles.badge, color: p.status === 'ACTIVE' ? '#10b981' : '#ef4444' }}>{p.status}</span>
                            </td>
                            <td style={styles.td}>{p.variants?.length || 0}개</td>
                            <td style={styles.td}>
                                <button style={styles.editBtn} onClick={() => navigate(`/admin/products/${p.id}`)}>수정</button>
                                <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {products.length === 0 && <p style={styles.empty}>등록된 상품이 없습니다.</p>}
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f8f8f8' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '18px', fontWeight: 600, color: '#111' },
    addBtn: { padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#666', borderBottom: '1px solid #eee' },
    tr: { borderBottom: '1px solid #f5f5f5' },
    td: { padding: '14px 16px', fontSize: '13px', color: '#333' },
    badge: { fontSize: '12px', fontWeight: 600 },
    editBtn: { padding: '5px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginRight: '6px' },
    deleteBtn: { padding: '5px 12px', background: '#fff', border: '1px solid #fcc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#c00' },
    empty: { textAlign: 'center', color: '#999', padding: '60px 0' },
};