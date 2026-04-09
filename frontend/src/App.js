import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UserHomePage from './pages/UserHomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderCompletePage from './pages/OrderCompletePage';
import OrderListPage from './pages/OrderListPage';
import StorePage from './pages/StorePage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminSettlementPage from './pages/admin/AdminSettlementPage';
import AdminAIPage from './pages/admin/AdminAIPage';

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

    const adminOnly = (element) => member && isAdmin ? element : <Navigate to="/login" />;
    const authOnly = (element) => member ? element : <Navigate to="/login" />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={member ? <Navigate to={isAdmin ? '/admin' : '/'} /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={member ? <Navigate to="/" /> : <SignupPage />} />

                {/* Admin */}
                <Route path="/admin" element={adminOnly(<HomePage member={member} onLogout={handleLogout} />)} />
                <Route path="/admin/products" element={adminOnly(<AdminProductListPage member={member} onLogout={handleLogout} />)} />
                <Route path="/admin/orders" element={adminOnly(<AdminOrderListPage member={member} onLogout={handleLogout} />)} />
                <Route path="/admin/inventory" element={adminOnly(<AdminInventoryPage member={member} onLogout={handleLogout} />)} />
                <Route path="/admin/settlements" element={adminOnly(<AdminSettlementPage member={member} onLogout={handleLogout} />)} />
                <Route path="/admin/ai" element={adminOnly(<AdminAIPage member={member} onLogout={handleLogout} />)} />

                {/* Store (누구나) */}
                <Route path="/store/:slug" element={<StorePage member={member} onLogout={handleLogout} />} />
                <Route path="/store/:slug/products/:id" element={<ProductDetailPage member={member} onLogout={handleLogout} />} />

                {/* User (누구나) */}
                <Route path="/" element={<UserHomePage member={member} onLogout={handleLogout} />} />
                <Route path="/products/:id" element={<ProductDetailPage member={member} onLogout={handleLogout} />} />
                <Route path="/cart" element={<CartPage member={member} onLogout={handleLogout} />} />

                {/* User (로그인 필요) */}
                <Route path="/checkout" element={authOnly(<CheckoutPage member={member} onLogout={handleLogout} />)} />
                <Route path="/order-complete" element={authOnly(<OrderCompletePage member={member} onLogout={handleLogout} />)} />
                <Route path="/orders" element={authOnly(<OrderListPage member={member} onLogout={handleLogout} />)} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;