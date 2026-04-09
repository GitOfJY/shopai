import AdminNav from '../../components/AdminNav';

export default function AdminSettlementPage({ member, onLogout }) {
    return (
        <div style={styles.container}>
            <AdminNav member={member} onLogout={onLogout} />
            <main style={styles.main}>
                <h2 style={styles.title}>정산</h2>
                <p style={styles.placeholder}>정산 기능은 준비중입니다.</p>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f8f8f8' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
    title: { fontSize: '18px', fontWeight: 600, marginBottom: '24px', color: '#111' },
    placeholder: { textAlign: 'center', color: '#999', padding: '80px 0', fontSize: '14px' },
};