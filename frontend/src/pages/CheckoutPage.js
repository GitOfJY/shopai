import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function CheckoutPage({ member, onLogout }) {
    const navigate = useNavigate();
    const [cart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [form, setForm] = useState({
        recipientName: member?.name || '',
        recipientPhone: member?.phone || '',
        shippingZipcode: member?.zipcode || '',
        shippingAddress: member?.address || '',
        shippingAddressDetail: member?.addressDetail || '',
    });
    const [loading, setLoading] = useState(false);
    const [storeInfo, setStoreInfo] = useState(null);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (cart.length > 0 && cart[0].productId) {
                try {
                    const prodRes = await api.get(`/products/${cart[0].productId}`);
                    const sellerId = prodRes.data.data.sellerId;
                    if (sellerId) {
                        const storeRes = await api.get(`/store/by-seller/${sellerId}`);
                        setStoreInfo(storeRes.data.data);
                    }
                } catch (err) { console.error(err); }
            }
        };
        fetchStoreInfo();
    }, [cart]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = totalAmount >= 50000 ? 0 : 3000;

    const handleOrder = async () => {
        if (cart.length === 0) { alert('장바구니가 비어있습니다.'); return; }
        setLoading(true);
        try {
            if (storeInfo) {
                localStorage.setItem('lastStoreInfo', JSON.stringify(storeInfo));
            }
            const body = {
                recipientName: form.recipientName,
                recipientPhone: form.recipientPhone,
                shippingZipcode: form.shippingZipcode,
                shippingAddress: form.shippingAddress,
                shippingAddressDetail: form.shippingAddressDetail,
                orderProducts: cart.map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
            };
            const res = await api.post('/orders', body);
            localStorage.removeItem('cart');
            navigate('/order-complete', { state: { order: res.data.data } });
        } catch (err) {
            alert(err.response?.data?.message || '주문 실패');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div>
                <UserNav member={member} onLogout={onLogout} />
                <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
                    <p>장바구니가 비어있습니다.</p>
                    <button style={styles.shopBtn} onClick={() => navigate('/')}>CONTINUE SHOPPING</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <h2 style={styles.title}>CHECKOUT</h2>

                <div style={styles.layout}>
                    <div style={styles.left}>
                        <h3 style={styles.sectionTitle}>SHIPPING INFORMATION</h3>

                        <label style={styles.label}>NAME</label>
                        <input style={styles.input} name="recipientName" value={form.recipientName} onChange={handleChange} />

                        <label style={styles.label}>PHONE</label>
                        <input style={styles.input} name="recipientPhone" value={form.recipientPhone} onChange={handleChange} />

                        <label style={styles.label}>ZIPCODE</label>
                        <input style={styles.input} name="shippingZipcode" value={form.shippingZipcode} onChange={handleChange} />

                        <label style={styles.label}>ADDRESS</label>
                        <input style={styles.input} name="shippingAddress" value={form.shippingAddress} onChange={handleChange} />

                        <label style={styles.label}>ADDRESS DETAIL</label>
                        <input style={styles.input} name="shippingAddressDetail" value={form.shippingAddressDetail} onChange={handleChange} />

                        <div style={styles.divider} />

                        <h3 style={styles.sectionTitle}>PAYMENT</h3>
                        <div style={styles.bankInfo}>
                            <p style={styles.bankTitle}>계좌이체</p>
                            <p style={styles.bankDetail}>
                                {storeInfo ? `${storeInfo.bankName} ${storeInfo.bankAccount}` : '계좌 정보 로딩중...'}
                            </p>
                            <p style={styles.bankDetail}>
                                예금주: {storeInfo ? storeInfo.bankHolder : '-'}
                            </p>
                            <p style={styles.bankNote}>주문 후 입금 확인 시 발송됩니다.</p>
                        </div>
                    </div>

                    <div style={styles.right}>
                        <h3 style={styles.sectionTitle}>ORDER SUMMARY</h3>

                        {cart.map(item => (
                            <div key={item.variantId} style={styles.item}>
                                <div style={styles.itemImg}>
                                    {item.imageUrl ? <img src={item.imageUrl} alt="" style={styles.img} /> : null}
                                </div>
                                <div style={styles.itemInfo}>
                                    <p style={styles.itemName}>{item.productName}</p>
                                    <p style={styles.itemOption}>{item.options}</p>
                                    <p style={styles.itemQty}>Qty: {item.quantity}</p>
                                </div>
                                <p style={styles.itemPrice}>KRW {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}

                        <div style={styles.summaryDivider} />

                        <div style={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>KRW {totalAmount.toLocaleString()}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shippingFee === 0 ? 'Free' : `KRW ${shippingFee.toLocaleString()}`}</span>
                        </div>
                        <div style={styles.summaryDivider} />
                        <div style={styles.totalRow}>
                            <span>Total</span>
                            <span>KRW {(totalAmount + shippingFee).toLocaleString()}</span>
                        </div>

                        <button
                            style={{ ...styles.orderBtn, opacity: loading ? 0.5 : 1 }}
                            onClick={handleOrder}
                            disabled={loading}
                        >{loading ? 'PROCESSING...' : 'PLACE ORDER'}</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' },
    title: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', marginBottom: '40px' },
    layout: { display: 'flex', gap: '60px' },
    left: { flex: 1 },
    right: { width: '380px', flexShrink: 0 },
    sectionTitle: { fontSize: '12px', fontWeight: 500, letterSpacing: '2px', marginBottom: '24px', color: '#333' },
    label: { display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '1px', color: '#333', marginBottom: '6px', marginTop: '16px' },
    input: { width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: '14px', outline: 'none', background: 'transparent' },
    divider: { height: '1px', background: '#eee', margin: '32px 0' },
    bankInfo: { background: '#fafafa', padding: '20px', marginTop: '8px' },
    bankTitle: { fontSize: '14px', fontWeight: 500, marginBottom: '8px' },
    bankDetail: { fontSize: '13px', color: '#333', marginBottom: '2px' },
    bankNote: { fontSize: '12px', color: '#999', marginTop: '8px' },
    item: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
    itemImg: { width: '64px', height: '80px', background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '13px', fontWeight: 500, marginBottom: '2px' },
    itemOption: { fontSize: '12px', color: '#888', marginBottom: '2px' },
    itemQty: { fontSize: '12px', color: '#888' },
    itemPrice: { fontSize: '13px', fontWeight: 500, flexShrink: 0 },
    summaryDivider: { height: '1px', background: '#eee', margin: '16px 0' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '8px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 500, marginBottom: '24px' },
    orderBtn: { width: '100%', padding: '16px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 500, letterSpacing: '2px', cursor: 'pointer' },
    shopBtn: { marginTop: '20px', padding: '14px 32px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' },
};