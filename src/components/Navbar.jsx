import React, { useState } from 'react';
import { FaBroadcastTower, FaSignOutAlt, FaUser, FaInfoCircle, FaList, FaHome, FaHeart, FaKey, FaShieldAlt, FaDownload } from 'react-icons/fa';
import SubmissionModal from './SubmissionModal';
import InfoModal from './InfoModal';
import DonationModal from './DonationModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { usePWA } from './PWAContext';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const { user, signOut, isSuperAdmin } = useAuth();
    const { isInstallable, showInstallPrompt } = usePWA();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSignOut = async () => {
        await signOut();
        toast.success('Successfully logged out. See you next time! 73');
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
                    onClick={() => {
                        window.dispatchEvent(new Event('resetFilters'));
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <img src="/logo.jpg" alt="MY-Callbook" style={{ height: '36px', width: '36px', borderRadius: '50%' }} />
                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
                        MY-Callbook
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                    {/* Install App Button - Only shown if installable */}
                    {isInstallable && (
                        <button
                            onClick={showInstallPrompt}
                            style={{
                                background: 'rgba(236, 72, 153, 0.2)',
                                border: '1px solid rgba(236, 72, 153, 0.4)',
                                color: '#ec4899',
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
                            title="Install App"
                        >
                            <FaDownload /> <span className="mobile-hidden">Install App</span>
                        </button>
                    )}

                    <button
                        onClick={() => { window.dispatchEvent(new Event('resetFilters')); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="mobile-hidden-element"
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
                    <a
                        href="https://frequency.hamradio.my"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: 'rgba(79, 172, 254, 0.2)',
                            border: '1px solid rgba(79, 172, 254, 0.4)',
                            color: '#4facfe',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            minWidth: '36px',
                            textDecoration: 'none'
                        }}
                        title="Repeaters, Simplex & PMR Frequencies"
                    >
                        <FaBroadcastTower /> <span className="mobile-hidden">Frequencies</span>
                    </a>
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
                            <button
                                onClick={() => setIsChangePasswordModalOpen(true)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-muted)',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginRight: '5px'
                                }}
                                title="Click to change password"
                            >
                                <FaUser className="mobile-hidden" /> <span className="mobile-hidden">{user.email}</span> <FaKey style={{ fontSize: '0.85rem' }} />
                            </button>
                            {isSuperAdmin && (
                                <button
                                    onClick={() => { navigate('/manage-admins'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    style={{
                                        background: 'rgba(255, 193, 7, 0.2)',
                                        border: '1px solid rgba(255, 193, 7, 0.4)',
                                        color: '#ffc107',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        marginRight: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    title="Manage Admins"
                                >
                                    <FaShieldAlt /> <span className="mobile-hidden">Admins</span>
                                </button>
                            )}
                            <button
                                onClick={() => { navigate('/my-callsigns'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                    .mobile-hidden-element { display: none !important; }
                    .mobile-only-lock { display: inline !important; }
                    .nav-container {
                        padding: 0.5rem 0.75rem !important;
                        margin: 8px !important;
                        gap: 4px;
                        flex-wrap: wrap;
                    }
                    .nav-container button {
                        padding: 6px !important;
                        min-width: 32px !important;
                    }
                }
                @media (min-width: 481px) {
                    .mobile-only-plus { display: none !important; }
                    .mobile-only-lock { display: none !important; }
                }
            `}</style>
            <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
        </>
    );
};

export default Navbar;
