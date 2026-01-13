import React, { useEffect } from 'react';
import { FaTimes, FaHeart } from 'react-icons/fa';

const DonationModal = ({ isOpen, onClose }) => {
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
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    padding: '40px',
                    maxWidth: '400px',
                    width: '100%',
                    position: 'relative',
                    background: '#1a1a1a',
                    textAlign: 'center'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}
                >
                    <FaTimes />
                </button>

                <div style={{ marginBottom: '20px' }}>
                    <FaHeart size={40} color="#ff6b6b" />
                </div>

                <h2 style={{
                    color: 'var(--primary)',
                    marginTop: 0,
                    marginBottom: '10px'
                }}>
                    Support MY-Callbook
                </h2>

                <p style={{
                    color: 'var(--text-muted)',
                    marginBottom: '25px',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                }}>
                    Help us cover server maintenance costs and keep MY-Callbook running smoothly for the Malaysian amateur radio community. Every contribution, big or small, makes a difference!
                </p>

                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <img
                        src="https://lh3.googleusercontent.com/d/1lf1zgIN1Kx5cduZM79n3boGDJQ68uSJ_=w1000?authuser=0"
                        alt="Donation QR Code"
                        style={{
                            width: '100%',
                            maxWidth: '280px',
                            height: 'auto',
                            borderRadius: '8px'
                        }}
                    />
                </div>

                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    margin: 0
                }}>
                    Scan with your banking or e-wallet app to donate
                </p>

                <p style={{
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    marginTop: '15px',
                    opacity: 0.8
                }}>
                    Thank you for your generous support! 73 de 9M2PJU
                </p>
            </div>
        </div>
    );
};

export default DonationModal;
