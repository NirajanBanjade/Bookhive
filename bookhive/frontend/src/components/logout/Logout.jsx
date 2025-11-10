import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import './Logout.css';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/home', { replace: true });
    };
    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="logout-button"
            >
                <LogOut className="h-4 w-4" />
                Logout?
            </button>

            {
                showConfirm && (
                    <>
                        <div className="logout-overlay" onClick={() => setShowConfirm(false)} />
                        <div className="logout-modal">
                            <h3>Confirm Logout?</h3>
                            <p>Are you sure you want to logout?</p>
                            <div className="logout-actions">
                                <button onClick={handleLogout} className="btn-yes">
                                    Yes, Logout
                                </button>
                                <button onClick={() => setShowConfirm(false)} className="btn-no">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
};

export default Logout;