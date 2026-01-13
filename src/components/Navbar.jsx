import React, { useState } from 'react';
import { FaBroadcastTower, FaSignOutAlt, FaUser } from 'react-icons/fa';
import SubmissionModal from './SubmissionModal';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <>
            <nav className="glass-panel nav-container" style={{
                margin: 'clamp(10px, 3vh, 20px)',
                padding: '1rem 2rem', // Base padding, overridden by CSS
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '20px',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBroadcastTower size={24} color="var(--primary)" />
                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
                        MY-Callbook
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span className="mobile-hidden" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '5px' }}>
                                <FaUser style={{ marginRight: '5px' }} /> {user.email}
                            </span>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                                style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                            >
                                <span className="mobile-hidden">+ Add Callsign</span>
                                <span style={{ display: 'none' }} className="mobile-visible">+</span> {/* CSS hack not needed if we just use + Add */}
                                <span className="mobile-only-plus">+</span>
                            </button>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-muted)',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    minWidth: '36px'
                                }}
                                title="Sign Out"
                            >
                                <FaSignOutAlt /> <span className="mobile-hidden">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span className="mobile-hidden">Restricted Access</span>
                            <span className="mobile-only-lock">🔒</span>
                        </div>
                    )}
                </div>
            </nav>
            <style>{`
                @media (max-width: 480px) {
                    .mobile-only-plus { display: inline !important; }
                    .mobile-hidden { display: none !important; }
                    .mobile-only-lock { display: inline !important; }
                }
                @media (min-width: 481px) {
                    .mobile-only-plus { display: none !important; }
                    .mobile-only-lock { display: none !important; }
                }
            `}</style>
            <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
