import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function UserHomePage({ member, onLogout }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = { page: 0, size: 30 };
                if (categoryFilter) params.category = categoryFilter;
                const res = await api.get('/products', { params });
                setProducts(res.data.data.content);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, [categoryFilter]);

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <h2 style={styles.sectionTitle}>{categoryFilter || 'ALL'}</h2>

                <div style={styles.grid}>
                    {products.map(product => (
                        <div
                            key={product.id}
                            style={styles.card}
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            <div style={styles.imgWrap}>
                                {product.imageUrl
                                    ? <img src={product.imageUrl} alt={product.name} style={styles.img} />
                                    : <div style={styles.noImg} />
                                }
                            </div>
                            <div style={styles.cardInfo}>
                                <p style={styles.cardName}>{product.name}</p>
                                <p style={styles.cardPrice}>KRW {Number(product.basePrice).toLocaleString()}</p>
                                {product.variants && product.variants.length > 0 && (
                                    <div style={styles.dots}>
                                        {product.variants.slice(0, 4).map((v, i) => (
                                            <span key={i} style={{
                                                ...styles.dot,
                                                background: ['#111', '#8B7355', '#C4A882', '#ddd'][i % 4],
                                            }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <p style={styles.empty}>No products found.</p>
                )}
            </main>

            <footer style={styles.footer}>
                <p>© 2026 SHOPAI. All rights reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 80px' },
    sectionTitle: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', textAlign: 'center', marginBottom: '40px', color: '#333' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 20px' },
    card: { cursor: 'pointer' },
    imgWrap: { width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden', marginBottom: '12px' },
    img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
    noImg: { width: '100%', height: '100%', background: '#f0f0f0' },
    cardInfo: { padding: '0 4px' },
    cardName: { fontSize: '13px', fontWeight: 400, color: '#111', marginBottom: '4px', letterSpacing: '0.5px' },
    cardPrice: { fontSize: '13px', fontWeight: 400, color: '#111', marginBottom: '8px' },
    dots: { display: 'flex', gap: '4px' },
    dot: { width: '10px', height: '10px', borderRadius: '50%', border: '0.5px solid #ccc' },
    empty: { textAlign: 'center', color: '#999', padding: '80px 0', fontSize: '14px' },
    footer: { borderTop: '1px solid #eee', padding: '40px', textAlign: 'center', fontSize: '12px', color: '#999', letterSpacing: '1px' },
};