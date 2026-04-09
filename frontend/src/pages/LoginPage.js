import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import UserNav from '../components/UserNav';

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/members/login', form);
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('member', JSON.stringify(res.data.data.member));
            onLogin(res.data.data.member);
            navigate(res.data.data.member.role === 'ADMIN' ? '/admin' : redirect);
        } catch (err) {
            setError(err.response?.data?.message || '로그인 실패');
        }
    };

    return (
        <div style={styles.container}>
            <UserNav member={null} onLogout={() => {}} />
            <main style={styles.main}>
                <h2 style={styles.title}>LOGIN</h2>
                <div>
                    {error && <p style={styles.error}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <label style={styles.label}>EMAIL</label>
                        <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required />
                        <label style={styles.label}>PASSWORD</label>
                        <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required />
                        <button style={styles.button} type="submit">LOGIN</button>
                    </form>
                    <p style={styles.joinText}>NEW USER? <Link to={`/signup?redirect=${redirect}`} style={styles.joinLink}>JOIN US NOW</Link></p>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#fff' },
    main: { maxWidth: '440px', margin: '0 auto', padding: '60px 24px 80px' },
    title: { fontSize: '14px', fontWeight: 500, letterSpacing: '2px', textAlign: 'center', marginBottom: '48px' },
    label: { display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '1px', color: '#333', marginBottom: '8px', marginTop: '20px' },
    input: { width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: '14px', outline: 'none', background: 'transparent' },
    button: { width: '100%', padding: '16px', background: '#111', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 500, letterSpacing: '2px', cursor: 'pointer', marginTop: '40px' },
    error: { color: '#c00', fontSize: '13px', textAlign: 'center', marginBottom: '12px' },
    joinText: { textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#999' },
    joinLink: { color: '#111', fontWeight: 500, textDecoration: 'underline' },
};