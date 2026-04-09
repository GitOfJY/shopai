import { useLocation, useNavigate } from 'react-router-dom';
import UserNav from '../components/UserNav';

export default function OrderCompletePage({ member, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div style={styles.container}>
            <UserNav member={member} onLogout={onLogout} />

            <main style={styles.main}>
                <div style={styles.card}>
                    <div style={styles.checkMark}>✓</div>
                    <h2 style={styles.title}>ORDER CONFIRMED</h2>
                    <p style={styles.desc}>주문이 완료되었습니다.</p>

                    {order && (
                        <div style={styles.info}>
                            <div style={styles.row}>
                                <span style={styles.label}>주문번호</span>
                                <span style={styles.value}>{order.orderNumber}</span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.label}>결제금액</span>
                                <span style={styles.value}>KRW {Number(order.totalAmount).toLocaleString()}</span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.label}>배송지</span>
                                <span style={styles.value}>{order.shippingAddress} {order.shippingAddressDetail}</span>
                            </div>
                        </div>
                    )}

                    <div style={styles.bankBox}>
                        <p style={styles.bankTitle}>입금 안내</p>
                        <p style={styles.bankDetail}>농협 301-0000-0000-00 (SHOPAI)</p>
                        <p style={styles.bankNote}>입금 확인 후 발송됩니다.</p>
                    </div>

                    <div style={styles.buttons}>
                        <button style={styles.btnPrimary} onClick={() => navigate('/orders')}>주문내역 보기</button>
                        <button style={styles.btnSecondary} onClick={() => navigate('/')}>쇼핑 계속하기</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '520px', margin: '0 auto', padding: '60px 24px 80px' },
    card: { textAlign: 'center' },
    checkMark: { width: '48px', height: '48px', borderRadius: '50%', background: '#111', color: '#fff', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
    title: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', marginBottom: '8px' },
    desc: { fontSize: '14px', color: '#666', marginBottom: '32px' },
    info: { textAlign: 'left', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '24px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' },
    label: { color: '#999' },
    value: { color: '#333', fontWeight: 500 },
    bankBox: { background: '#fafafa', padding: '20px', marginBottom: '32px', textAlign: 'left' },
    bankTitle: { fontSize: '13px', fontWeight: 500, marginBottom: '8px' },
    bankDetail: { fontSize: '13px', color: '#333', marginBottom: '4px' },
    bankNote: { fontSize: '12px', color: '#999', marginTop: '8px' },
    buttons: { display: 'flex', gap: '12px' },
    btnPrimary: { flex: 1, padding: '14px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' },
    btnSecondary: { flex: 1, padding: '14px', background: '#fff', color: '#111', border: '1px solid #ddd', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' },
};