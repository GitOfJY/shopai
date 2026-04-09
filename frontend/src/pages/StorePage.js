import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function StorePage({ member, onLogout }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const categoryFilter = searchParams.get('category') || '';

    const fetchStore = useCallback(async () => {
        try {
            const res = await api.get(`/store/${slug}`);
            setStore(res.data.data);
        } catch (err) { navigate('/'); }
    }, [slug, navigate]);

    const fetchProducts = useCallback(async () => {
        try {
            const params = { page: 0, size: 30 };
            if (categoryFilter) params.category = categoryFilter;
            const res = await api.get(`/store/${slug}/products`, { params });
            const content = res.data.data.content;
            setProducts(content);
            if (!categoryFilter) {
                setCategories([...new Set(content.map(p => p.category).filter(Boolean))]);
            }
        } catch (err) { console.error(err); }
    }, [slug, categoryFilter]);

    useEffect(() => { fetchStore(); }, [fetchStore]);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    if (!store) return <div style={{ padding: '120px', textAlign: 'center', color: '#999' }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.topBar}>
                    <span style={styles.topMsg}>WELCOME TO {store.storeName}</span>
                </div>
                <div style={styles.navWrap}>
                    <nav style={styles.navLeft}>
                        {categories.map(cat => (
                            <span
                                key={cat}
                                style={categoryFilter === cat ? styles.navItemActive : styles.navItem}
                                onClick={() => navigate(`/store/${slug}?category=${cat}`)}
                            >{cat}</span>
                        ))}
                        {categoryFilter && (
                            <span style={styles.navItem} onClick={() => navigate(`/store/${slug}`)}>ALL</span>
                        )}
                    </nav>
                    <h1 style={styles.logo} onClick={() => navigate(`/store/${slug}`)}>{store.storeName}</h1>
                    <div style={styles.right}>
                        {member ? (
                            <>
                                <span style={styles.icon} onClick={() => navigate('/orders')}>Orders</span>
                                <span style={styles.icon} onClick={() => navigate('/cart')}>Cart</span>
                                <span style={styles.icon}>{member.name}</span>
                                <span style={styles.logout} onClick={onLogout}>Logout</span>
                            </>
                        ) : (
                            <>
                                <span style={styles.icon} onClick={() => navigate('/cart')}>Cart</span>
                                <span style={styles.icon} onClick={() => navigate(`/login?redirect=/store/${slug}`)}>Login</span>
                                <span style={styles.icon} onClick={() => navigate(`/signup?redirect=/store/${slug}`)}>Join</span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main style={styles.main}>
                <div style={styles.grid}>
                    {products.map(product => (
                        <div key={product.id} style={styles.card} onClick={() => navigate(`/store/${slug}/products/${product.id}`)}>
                            <div style={styles.imgWrap}>
                                {product.imageUrl
                                    ? <img src={product.imageUrl} alt={product.name} style={styles.img} />
                                    : <div style={styles.noImg} />
                                }
                            </div>
                            <div style={styles.cardInfo}>
                                <p style={styles.cardName}>{product.name}</p>
                                <p style={styles.cardPrice}>KRW {Number(product.basePrice).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {products.length === 0 && <p style={styles.empty}>No products found.</p>}
            </main>

            <footer style={styles.footer}>
                <p>© 2026 {store.storeName}. Powered by SHOPAI</p>
            </footer>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    header: { position: 'sticky', top: 0, zIndex: 100, background: '#fff' },
    topBar: { background: '#111', color: '#fff', textAlign: 'center', padding: '8px 0', fontSize: '11px', letterSpacing: '1px' },
    topMsg: { fontWeight: 400 },
    navWrap: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #eee' },
    navLeft: { display: 'flex', gap: '24px', flex: 1 },
    navItem: { fontSize: '12px', fontWeight: 500, letterSpacing: '1px', cursor: 'pointer', color: '#888' },
    navItemActive: { fontSize: '12px', fontWeight: 500, letterSpacing: '1px', cursor: 'pointer', color: '#111' },
    logo: { fontSize: '28px', fontWeight: 700, letterSpacing: '4px', cursor: 'pointer', textAlign: 'center' },
    right: { display: 'flex', gap: '20px', alignItems: 'center', fontSize: '12px', flex: 1, justifyContent: 'flex-end' },
    icon: { cursor: 'pointer', color: '#333' },
    logout: { cursor: 'pointer', color: '#999' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 80px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 20px' },
    card: { cursor: 'pointer' },
    imgWrap: { width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden', marginBottom: '12px' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    noImg: { width: '100%', height: '100%', background: '#f0f0f0' },
    cardInfo: { padding: '0 4px' },
    cardName: { fontSize: '13px', fontWeight: 400, color: '#111', marginBottom: '4px' },
    cardPrice: { fontSize: '13px', fontWeight: 400, color: '#111' },
    empty: { textAlign: 'center', color: '#999', padding: '80px 0' },
    footer: { borderTop: '1px solid #eee', padding: '40px', textAlign: 'center', fontSize: '12px', color: '#999', letterSpacing: '1px' },
};