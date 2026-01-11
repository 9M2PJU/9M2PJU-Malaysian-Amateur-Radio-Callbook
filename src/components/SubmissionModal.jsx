import React from 'react';
import { FaTimes, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

const SubmissionModal = ({ isOpen, onClose }) => {
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
            zIndex: 1000
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{
                    margin: '20px',
                    padding: '40px',
                    maxWidth: '600px',
                    width: '100%',
                    position: 'relative',
                    background: '#1a1a1a'
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

                <h2 style={{ color: 'var(--primary)', marginTop: 0 }}>Register New Callsign</h2>

                <p style={{ lineHeight: '1.6' }}>
                    To add your callsign to the directory, please email your details to:
                </p>

                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <a href="mailto:9m2pju@hamradio.my?subject=New Callbook Registration&body=Callsign:%0D%0AName:%0D%0ALocation:%0D%0AEmail (Optional):%0D%0APhone (Optional):%0D%0AAddress (Optional):"
                        style={{
                            color: 'var(--secondary)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                        <FaEnvelope /> 9m2pju@hamradio.my
                    </a>
                </div>

                <h3>Required Format</h3>
                <pre style={{
                    background: '#000',
                    padding: '15px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    color: '#0f0'
                }}>
                    Callsign: [Your Callsign]
                    Name: [Your Name]
                    Location: [State/City]
                    Email: [Optional]
                    Phone: [Optional]
                    Address: [Optional]
                </pre>

                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: 'rgba(255, 100, 100, 0.1)',
                    borderLeft: '4px solid #ff4444',
                    borderRadius: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4444', fontWeight: 'bold', marginBottom: '8px' }}>
                        <FaExclamationTriangle /> Privacy Disclaimer
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffaaaa' }}>
                        Submission is voluntary. By submitting your details via email, you agree to have this information published publicly in this directory.
                        The maintainer is not responsible for any privacy breach or misuse of the published information.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SubmissionModal;
