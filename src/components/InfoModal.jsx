import React, { useEffect } from 'react';
import { FaTimes, FaBroadcastTower, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';

const InfoModal = ({ isOpen, onClose }) => {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'auto',
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    padding: '20px',
                    maxWidth: '450px', // More compact width
                    width: '90%',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflowY: 'auto', // Keep auto just in case, but structure is much smaller now
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}
                >
                    <FaTimes />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <FaBroadcastTower size={32} color="var(--primary)" />
                    <h2 style={{ color: 'var(--primary)', margin: '5px 0 0', fontSize: '1.4rem' }}>What is the Callbook?</h2>

                    <div style={{
                        margin: '10px auto',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)'
                    }}>
                        <p style={{ margin: '0 0 2px 0', color: 'var(--secondary)' }}><strong>Noun</strong>: callbook (plural callbooks)</p>
                        <p style={{ margin: '0 0 5px 0' }}><em>Etymology: From call +‎ book.</em></p>
                        <p style={{ margin: 0, color: '#fff' }}>A directory of radio station call signs.</p>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0' }}>
                        The <strong>Malaysian Amateur Radio Callbook</strong> is a comprehensive directory.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #4facfe'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                            <FaUserFriends /> For Short Wave Listeners (SWL)
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                            Find nearest <strong>9M</strong> to sign <strong>Class A recommendation MCMC form</strong>.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #ff4444'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                            <FaExclamationTriangle /> Emergency Purposes
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                            Vital resource to locate operators for emergency communications during crises.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #00c853'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                            🤝 Community Projects
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                            Connect with operators for community service and technical collaboration.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        className="btn-primary"
                        style={{ padding: '8px 25px', fontSize: '0.9rem' }}
                    >
                        Close
                    </button>
                </div>
            </div>
            <style>{`
                @media (max-width: 480px) {
                    .glass-panel {
                        padding: 15px !important;
                        width: 95% !important;
                        max-height: 95vh !important;
                    }
                    h2 { font-size: 1.2rem !important; }
                    p { font-size: 0.85rem !important; }
                    h3 { font-size: 0.95rem !important; }
                }

                /* Hide scrollbar for Chrome, Safari and Opera */
                .glass-panel::-webkit-scrollbar {
                    display: none;
                }

                /* Hide scrollbar for IE, Edge and Firefox */
                .glass-panel {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default InfoModal;
