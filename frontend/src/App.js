import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UserHomePage from './pages/UserHomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';

function App() {
    const [member, setMember] = useState(() => {
        const saved = localStorage.getItem('member');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogin = (memberData) => {
        setMember(memberData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('member');
        localStorage.removeItem('cart');
        setMember(null);
    };

    const isAdmin = member?.role === 'ADMIN';

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={member ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={member ? <Navigate to="/" /> : <SignupPage />} />

                {/* 어드민 */}
                {member && isAdmin && (
                    <Route path="/admin/*" element={<HomePage member={member} onLogout={handleLogout} />} />
                )}

                {/* 누구나 접근 가능 (비로그인 포함) */}
                <Route path="/" element={<UserHomePage member={member} onLogout={handleLogout} />} />
                <Route path="/products/:id" element={<ProductDetailPage member={member} onLogout={handleLogout} />} />
                <Route path="/cart" element={<CartPage member={member} onLogout={handleLogout} />} />

                {/* 로그인 필요 */}
                <Route path="/orders" element={member ? <OrderListPage member={member} onLogout={handleLogout} /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;