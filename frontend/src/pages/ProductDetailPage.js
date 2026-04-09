import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function ProductDetailPage({ member, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchProduct();
    }, [id]);

    const handleOptionSelect = (groupName, value) => {
        const newOptions = { ...selectedOptions, [groupName]: value };
        setSelectedOptions(newOptions);

        if (product.optionGroups && Object.keys(newOptions).length === product.optionGroups.length) {
            const selectedValues = Object.values(newOptions).sort();
            const variant = product.variants.find(v => {
                const variantValues = [...v.optionValues].sort();
                return JSON.stringify(variantValues) === JSON.stringify(selectedValues);
            });
            setSelectedVariant(variant || null);
        }
    };

    const totalPrice = () => {
        if (!product || !selectedVariant) return product ? Number(product.basePrice) : 0;
        return Number(product.basePrice) + Number(selectedVariant.additionalPrice);
    };

    const handleAddToCart = () => {
        if (!selectedVariant) { alert('옵션을 선택해주세요.'); return; }
        if (selectedVariant.stockQuantity < quantity) { alert('재고가 부족합니다.'); return; }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.variantId === selectedVariant.id);
        if (existing) { existing.quantity += quantity; }
        else {
            cart.push({
                variantId: selectedVariant.id, productId: product.id, productName: product.name,
                options: Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', '),
                sku: selectedVariant.sku, price: totalPrice(), quantity, imageUrl: product.imageUrl,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('장바구니에 추가했습니다.');
    };

    if (!product) return <div style={{ padding: '120px', textAlign: 'center', color: '#999' }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <p style={styles.breadcrumb} onClick={() => navigate(-1)}>← Back</p>

                <div style={styles.detail}>
                    <div style={styles.imgArea}>
                        {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name} style={styles.img} />
                            : <div style={styles.noImg} />
                        }
                    </div>

                    <div style={styles.info}>
                        <p style={styles.category}>{product.category}</p>
                        <h2 style={styles.name}>{product.name}</h2>
                        <p style={styles.price}>KRW {Number(product.basePrice).toLocaleString()}</p>

                        <div style={styles.divider} />

                        <p style={styles.desc}>{product.description}</p>

                        {product.optionGroups && product.optionGroups.map(group => (
                            <div key={group.id} style={styles.optionGroup}>
                                <p style={styles.optionLabel}>{group.name}</p>
                                <div style={styles.optionBtns}>
                                    {group.optionValues.map(ov => (
                                        <button
                                            key={ov.id}
                                            style={selectedOptions[group.name] === ov.value ? styles.optActive : styles.optBtn}
                                            onClick={() => handleOptionSelect(group.name, ov.value)}
                                        >{ov.value}</button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {selectedVariant && (
                            <div style={styles.variantInfo}>
                                {selectedVariant.stockQuantity > 0
                                    ? <span style={styles.inStock}>In Stock ({selectedVariant.stockQuantity})</span>
                                    : <span style={styles.outStock}>Out of Stock</span>
                                }
                                {Number(selectedVariant.additionalPrice) > 0 && (
                                    <span style={styles.addPrice}>+KRW {Number(selectedVariant.additionalPrice).toLocaleString()}</span>
                                )}
                            </div>
                        )}

                        <div style={styles.qtyRow}>
                            <span style={styles.qtyLabel}>Quantity</span>
                            <div style={styles.qtyControl}>
                                <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span style={styles.qty}>{quantity}</span>
                                <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div style={styles.divider} />

                        <p style={styles.total}>KRW {(totalPrice() * quantity).toLocaleString()}</p>

                        <button style={styles.addBtn} onClick={handleAddToCart}>ADD TO CART</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '20px 40px 80px' },
    breadcrumb: { fontSize: '13px', color: '#999', cursor: 'pointer', marginBottom: '24px' },
    detail: { display: 'flex', gap: '60px' },
    imgArea: { width: '520px', aspectRatio: '3/4', background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    noImg: { width: '100%', height: '100%', background: '#f0f0f0' },
    info: { flex: 1, paddingTop: '8px' },
    category: { fontSize: '12px', color: '#999', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' },
    name: { fontSize: '24px', fontWeight: 500, marginBottom: '12px', letterSpacing: '0.5px' },
    price: { fontSize: '16px', fontWeight: 400, color: '#111', marginBottom: '20px' },
    divider: { height: '1px', background: '#eee', margin: '20px 0' },
    desc: { fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '24px' },
    optionGroup: { marginBottom: '20px' },
    optionLabel: { fontSize: '12px', fontWeight: 500, letterSpacing: '1px', marginBottom: '10px', color: '#333', textTransform: 'uppercase' },
    optionBtns: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    optBtn: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: '0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 400, transition: 'all 0.2s' },
    optActive: { padding: '10px 20px', border: '1px solid #111', borderRadius: '0', background: '#111', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 400 },
    variantInfo: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', fontSize: '13px' },
    inStock: { color: '#2d7d46' },
    outStock: { color: '#c00' },
    addPrice: { color: '#666' },
    qtyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
    qtyLabel: { fontSize: '12px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' },
    qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #ddd' },
    qtyBtn: { width: '40px', height: '40px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '18px', color: '#333' },
    qty: { width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 500 },
    total: { fontSize: '18px', fontWeight: 500, marginBottom: '20px', letterSpacing: '0.5px' },
    addBtn: { width: '100%', padding: '16px', background: '#111', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, letterSpacing: '2px', cursor: 'pointer', transition: 'background 0.2s' },
};