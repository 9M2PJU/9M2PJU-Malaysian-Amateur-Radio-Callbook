import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { useAuth } from './AuthContext';
import { FaLock, FaEnvelope, FaSpinner, FaUser } from 'react-icons/fa';

const Register = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters");
            return;
        }



        if (!captchaToken) {
            setError("Please complete the security check");
            return;
        }

        setLoading(true);

        try {
            const { error, data } = await signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://callbook.hamradio.my',
                    captchaToken
                }
            });
            if (error) throw error;

            if (data?.session) {
                // Auto logged in?
                navigate('/');
            } else {
                setMessage('Registration successful! Please check your email for the confirmation link.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div style={{
                margin: 'auto',
                padding: '20px',
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(15px, 3vh, 30px)' }}>
                    <h2 style={{
                        marginTop: 0,
                        background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the community</p>
                </div>

                <div className="glass-panel" style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: 'clamp(20px, 4vw, 30px)'
                }}>
                    {error && (
                        <div style={{
                            background: 'rgba(255,0,0,0.1)',
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

                    {message && (
                        <div style={{
                            background: 'rgba(0,200,83,0.1)',
                            border: '1px solid #00c853',
                            color: '#00c853',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            fontSize: '0.85rem'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.9rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.9rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Min 6 chars"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.9rem' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem'
                                    }}
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        {/* Turnstile / Captcha */}
                        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                            <Turnstile
                                sitekey="0x4AAAAAACM4A9z-qhrcwAcp"
                                onVerify={setCaptchaToken}
                                theme="dark"
                            />
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
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {loading ? <><FaSpinner className="spin" /> Creating Account...</> : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
