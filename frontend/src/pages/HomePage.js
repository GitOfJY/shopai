export default function HomePage({ member, onLogout }) {
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>ShopAI</h1>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>{member.name}님</span>
                    <button style={styles.logoutBtn} onClick={onLogout}>로그아웃</button>
                </div>
            </nav>
            <main style={styles.main}>
                <h2>환영합니다, {member.name}님!</h2>
                <p style={styles.email}>{member.email}</p>
                <div style={styles.cardGrid}>
                    <div style={styles.card}>
                        <h3>상품 관리</h3>
                        <p>상품 등록/수정/삭제</p>
                    </div>
                    <div style={styles.card}>
                        <h3>주문 관리</h3>
                        <p>주문 조회/상태 변경</p>
                    </div>
                    <div style={styles.card}>
                        <h3>재고 관리</h3>
                        <p>입출고/이력 관리</p>
                    </div>
                    <div style={styles.card}>
                        <h3>AI 분석</h3>
                        <p>재고 분석/예측</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f5f5f5' },
    nav: { background: '#333', color: '#fff', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontSize: '20px', fontWeight: '700' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    welcome: { fontSize: '14px' },
    logoutBtn: { background: 'none', border: '1px solid #fff', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    main: { maxWidth: '800px', margin: '40px auto', padding: '0 24px' },
    email: { color: '#888', marginTop: '4px' },
    cardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' },
    card: { background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
};