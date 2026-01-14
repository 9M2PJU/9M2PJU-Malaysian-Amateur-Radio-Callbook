import React, { useState } from 'react';
import { FaTimes, FaLock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { updatePassword, user } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        // Validate old password is not the same as new
        if (oldPassword === newPassword) {
            setError('New password must be different from old password');
            return;
        }

        setLoading(true);

        try {
            // Verify old password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: oldPassword
            });

            if (signInError) {
                throw new Error('Current password is incorrect');
            }

            // Update to new password
            const { error } = await updatePassword(newPassword);
            if (error) throw error;

            setSuccess(true);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            // Auto close after success
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '25px',
                position: 'relative'
            }}>
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    <FaTimes />
                </button>

                <h2 style={{
                    marginTop: 0,
                    marginBottom: '20px',
                    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: '1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FaLock /> Change Password
                </h2>

                {success ? (
                    <div style={{
                        background: 'rgba(0, 255, 0, 0.1)',
                        border: '1px solid #00ff00',
                        color: '#00ff00',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <FaCheckCircle style={{ fontSize: '2rem' }} />
                        <span>Password changed successfully!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                background: 'rgba(255, 0, 0, 0.1)',
                                border: '1px solid #ff4444',
                                color: '#ff6666',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                                fontSize: '0.9rem'
                            }}>
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '12px',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }} />
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 38px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                                fontSize: '0.9rem'
                            }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '12px',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 38px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                                fontSize: '0.9rem'
                            }}>
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '12px',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 38px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: loading
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: loading ? 'var(--text-muted)' : '#000',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'wait' : 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spin" /> Updating...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
