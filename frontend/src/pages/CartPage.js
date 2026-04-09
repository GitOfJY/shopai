import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from '../components/UserNav';

export default function CartPage({ member, onLogout }) {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

    const updateCart = (newCart) => { setCart(newCart); localStorage.setItem('cart', JSON.stringify(newCart)); };
    const removeItem = (variantId) => updateCart(cart.filter(item => item.variantId !== variantId));
    const updateQuantity = (variantId, delta) => {
        updateCart(cart.map(item => item.variantId === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <h2 style={styles.title}>CART</h2>

                {cart.length === 0 ? (
                    <div style={styles.empty}>
                        <p>Your cart is empty.</p>
                        <button style={styles.shopBtn} onClick={() => navigate('/')}>CONTINUE SHOPPING</button>
                    </div>
                ) : (
                    <div style={styles.layout}>
                        <div style={styles.items}>
                            <div style={styles.tableHead}>
                                <span style={{ flex: 2 }}>Product</span>
                                <span style={{ flex: 1, textAlign: 'center' }}>Quantity</span>
                                <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
                            </div>

                            {cart.map(item => (
                                <div key={item.variantId} style={styles.item}>
                                    <div style={styles.itemLeft}>
                                        <div style={styles.itemImg}>
                                            {item.imageUrl ? <img src={item.imageUrl} alt="" style={styles.img} /> : null}
                                        </div>
                                        <div>
                                            <p style={styles.itemName}>{item.productName}</p>
                                            <p style={styles.itemOption}>{item.options}</p>
                                            <p style={styles.itemPrice}>KRW {item.price.toLocaleString()}</p>
                                            <button style={styles.removeBtn} onClick={() => removeItem(item.variantId)}>Remove</button>
                                        </div>
                                    </div>
                                    <div style={styles.itemCenter}>
                                        <div style={styles.qtyControl}>
                                            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.variantId, -1)}>−</button>
                                            <span style={styles.qty}>{item.quantity}</span>
                                            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.variantId, 1)}>+</button>
                                        </div>
                                    </div>
                                    <div style={styles.itemRight}>
                                        <p style={styles.itemTotal}>KRW {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.summary}>
                            <h3 style={styles.summaryTitle}>ORDER SUMMARY</h3>
                            <div style={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>KRW {totalAmount.toLocaleString()}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>{totalAmount >= 50000 ? 'Free' : 'KRW 3,000'}</span>
                            </div>
                            <div style={styles.summaryDivider} />
                            <div style={styles.summaryTotalRow}>
                                <span>Total</span>
                                <span>KRW {(totalAmount >= 50000 ? totalAmount : totalAmount + 3000).toLocaleString()}</span>
                            </div>
                            <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>CHECKOUT</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' },
    title: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', marginBottom: '40px' },
    empty: { textAlign: 'center', padding: '80px 0' },
    shopBtn: { marginTop: '20px', padding: '14px 32px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' },
    layout: { display: 'flex', gap: '60px' },
    items: { flex: 2 },
    tableHead: { display: 'flex', paddingBottom: '12px', borderBottom: '1px solid #eee', marginBottom: '20px', fontSize: '11px', fontWeight: 500, letterSpacing: '1px', color: '#999', textTransform: 'uppercase' },
    item: { display: 'flex', alignItems: 'center', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #f5f5f5' },
    itemLeft: { flex: 2, display: 'flex', gap: '16px' },
    itemImg: { width: '100px', height: '130px', background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    itemName: { fontSize: '14px', fontWeight: 500, marginBottom: '4px' },
    itemOption: { fontSize: '12px', color: '#888', marginBottom: '4px' },
    itemPrice: { fontSize: '13px', color: '#333', marginBottom: '8px' },
    removeBtn: { background: 'none', border: 'none', fontSize: '12px', color: '#999', cursor: 'pointer', textDecoration: 'underline' },
    itemCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
    qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #eee' },
    qtyBtn: { width: '32px', height: '32px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '16px' },
    qty: { width: '32px', textAlign: 'center', fontSize: '13px' },
    itemRight: { flex: 1, textAlign: 'right' },
    itemTotal: { fontSize: '14px', fontWeight: 500 },
    summary: { flex: 1, background: '#fafafa', padding: '32px', height: 'fit-content' },
    summaryTitle: { fontSize: '12px', fontWeight: 500, letterSpacing: '2px', marginBottom: '24px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '12px' },
    summaryDivider: { height: '1px', background: '#ddd', margin: '16px 0' },
    summaryTotalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 500, marginBottom: '24px' },
    checkoutBtn: { width: '100%', padding: '16px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 500, letterSpacing: '2px', cursor: 'pointer' },
};