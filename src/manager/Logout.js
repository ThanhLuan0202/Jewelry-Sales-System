import React from "react";
import "./Logout.css"
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('logoutMessage', "Bạn đã đăng xuất tài khoản");
        localStorage.removeItem('tab');
        navigate('/');
    };
    return (
        <div className="logout-l" onClick={handleLogout}>
            <i class="fas fa-sign-out-alt"></i>
        </div>
    )
}

export default Logout;