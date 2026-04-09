import { useNavigate } from 'react-router-dom';

export default function UserNav({ member, onLogout }) {
    const navigate = useNavigate();
    const categories = ['BEST', 'OUTER', 'TOP', 'BOTTOM', 'SHOES', 'ACC'];

    return (
        <header style={styles.header}>
            <div style={styles.topBar}>
                <span style={styles.topMsg}>WELCOME TO SHOPAI — FREE SHIPPING ON ORDERS OVER ₩50,000</span>
            </div>
            <div style={styles.navWrap}>
                <nav style={styles.navLeft}>
                    {categories.map(cat => (
                        <span key={cat} style={styles.navItem} onClick={() => navigate(`/?category=${cat}`)}>{cat}</span>
                    ))}
                </nav>

                <h1 style={styles.logo} onClick={() => navigate('/')}>SHOPAI</h1>

                <div style={styles.right}>
                    {member ? (
                        <>
                            {member.role === 'ADMIN' && <span style={styles.icon} onClick={() => navigate('/admin')}>Admin</span>}
                            <span style={styles.icon} onClick={() => navigate('/orders')}>Orders</span>
                            <span style={styles.icon} onClick={() => navigate('/cart')}>Cart</span>
                            <span style={styles.icon}>{member.name}</span>
                            <span style={styles.logout} onClick={onLogout}>Logout</span>
                        </>
                    ) : (
                        <>
                            <span style={styles.icon} onClick={() => navigate('/cart')}>Cart</span>
                            <span style={styles.icon} onClick={() => navigate('/login')}>Login</span>
                            <span style={styles.icon} onClick={() => navigate('/signup')}>Join</span>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

const styles = {
    header: { position: 'sticky', top: 0, zIndex: 100, background: '#fff' },
    topBar: { background: '#111', color: '#fff', textAlign: 'center', padding: '8px 0', fontSize: '11px', letterSpacing: '1px', fontWeight: 400 },
    navWrap: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #eee' },
    navLeft: { display: 'flex', gap: '24px', flex: 1 },
    navItem: { fontSize: '12px', fontWeight: 500, letterSpacing: '1px', cursor: 'pointer', color: '#333' },
    logo: { fontSize: '28px', fontWeight: 700, letterSpacing: '4px', cursor: 'pointer', textAlign: 'center' },
    right: { display: 'flex', gap: '20px', alignItems: 'center', fontSize: '12px', flex: 1, justifyContent: 'flex-end' },
    icon: { cursor: 'pointer', color: '#333', fontWeight: 400 },
    logout: { cursor: 'pointer', color: '#999', fontWeight: 400 },
};