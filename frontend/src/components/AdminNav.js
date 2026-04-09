import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminNav({ member, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        { label: '대시보드', path: '/admin' },
        { label: '상품', path: '/admin/products' },
        { label: '주문', path: '/admin/orders' },
        { label: '재고', path: '/admin/inventory' },
        { label: '정산', path: '/admin/settlements' },
        { label: 'AI 분석', path: '/admin/ai' },
    ];

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <h1 style={styles.logo} onClick={() => navigate('/admin')}>SHOPAI</h1>
                <span style={styles.badge}>ADMIN</span>
            </div>
            <div style={styles.menus}>
                {menus.map(menu => (
                    <span
                        key={menu.path}
                        style={isActive(menu.path) ? styles.menuActive : styles.menu}
                        onClick={() => navigate(menu.path)}
                    >{menu.label}</span>
                ))}
            </div>
            <div style={styles.right}>
                <span style={styles.shop} onClick={() => navigate('/')}>Shop</span>
                <span style={styles.name}>{member.name}</span>
                <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: '#111', color: '#fff', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
    left: { display: 'flex', alignItems: 'center', gap: '8px' },
    logo: { fontSize: '18px', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' },
    badge: { fontSize: '10px', fontWeight: 600, letterSpacing: '1px', background: '#333', padding: '2px 6px', borderRadius: '3px', color: '#999' },
    menus: { display: 'flex', gap: '24px' },
    menu: { fontSize: '13px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' },
    menuActive: { fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: 500 },
    right: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' },
    shop: { cursor: 'pointer', color: '#888' },
    name: { color: '#888' },
    logoutBtn: { background: 'none', border: '1px solid #444', color: '#888', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};