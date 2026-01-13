import React, { useState } from 'react';
import { FaBroadcastTower, FaSignOutAlt, FaUser, FaInfoCircle, FaList, FaHome, FaHeart } from 'react-icons/fa';
import SubmissionModal from './SubmissionModal';
import InfoModal from './InfoModal';
import DonationModal from './DonationModal';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
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
                <div
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <FaBroadcastTower size={24} color="var(--primary)" />
                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
                        MY-Callbook
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
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
                        title="Home"
                    >
                        <FaHome /> <span className="mobile-hidden">Home</span>
                    </button>
                    <button
                        onClick={() => setIsInfoModalOpen(true)}
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
                        title="About Callbook"
                    >
                        <FaInfoCircle /> <span className="mobile-hidden">Info</span>
                    </button>
                    <button
                        onClick={() => setIsDonationModalOpen(true)}
                        style={{
                            background: 'rgba(255, 107, 107, 0.2)',
                            border: '1px solid rgba(255, 107, 107, 0.4)',
                            color: '#ff6b6b',
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
                        title="Support Us"
                    >
                        <FaHeart /> <span className="mobile-hidden">Donate</span>
                    </button>
                    {user ? (
                        <>
                            <span className="mobile-hidden" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '5px' }}>
                                <FaUser style={{ marginRight: '5px' }} /> {user.email}
                            </span>
                            <button
                                onClick={() => navigate('/my-callsigns')}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-muted)',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    marginRight: '5px'
                                }}
                                title="My Callsigns"
                            >
                                <FaList /> <span className="mobile-hidden">My Callsigns</span>
                            </button>
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
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
        </>
    );
};

export default Navbar;
