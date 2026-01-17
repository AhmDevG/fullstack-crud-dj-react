import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./components/Login_Page";
import Header from "./components/Header";
import {ProductPage} from "./components/ProductPage";
import SignUpPage from "./components/SignUpPage";

const dummy_user = {
    name: "john_doe",
}

function App() {
    const navigate = useNavigate();

    function onLogin() {
        navigate('/login');
    }
    function onSignup() {
        navigate('/signup');
    }
    function onLogout() {
        localStorage.removeItem('userToken');
        navigate('/login');
    }

    return (
        <>
            <Header  onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} user={dummy_user} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/" element={<ProductPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </>
    );
}

export default function AppWithRouter() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
