import React from 'react';
import { FaTimes, FaBroadcastTower, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';

const InfoModal = ({ isOpen, onClose }) => {
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
                    padding: '40px',
                    maxWidth: '600px',
                    width: '100%',
                    position: 'relative',
                    background: '#1a1a1a',
                    maxHeight: '90vh',
                    overflowY: 'auto'
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

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <FaBroadcastTower size={50} color="var(--primary)" />
                    <h2 style={{ color: 'var(--primary)', margin: '15px 0 0' }}>What is the Callbook?</h2>

                    <div style={{
                        margin: '20px auto',
                        padding: '15px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)'
                    }}>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}><strong>Noun</strong>: callbook (plural callbooks)</p>
                        <p style={{ margin: '0 0 10px 0' }}><em>Etymology: From call +‎ book.</em></p>
                        <p style={{ margin: 0, color: '#fff' }}>A directory of radio station call signs.</p>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        The <strong>Malaysian Amateur Radio Callbook</strong> is a comprehensive directory of amateur radio operators in Malaysia.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        borderLeft: '4px solid #4facfe'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaUserFriends /> For Short Wave Listeners (SWL)
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            Easily find the nearest <strong>9M</strong> (Malaysian Amateur Radio Operator) to sign the <strong>2 of Class A operator recommendation MCMC form</strong>.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        borderLeft: '4px solid #ff4444'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaExclamationTriangle /> Emergency Purposes
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            In times of crisis or communication breakdown, this directory serves as a vital resource to locate and contact radio operators who can assist with emergency communications.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        borderLeft: '4px solid #00c853'
                    }}>
                        <h3 style={{ color: '#fff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🤝 Community & Voluntary Projects
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            Connect with fellow operators for community service projects, voluntary events, and technical collaboration.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        className="btn-primary"
                        style={{ padding: '10px 30px' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
