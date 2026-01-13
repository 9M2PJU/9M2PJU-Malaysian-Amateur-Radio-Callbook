import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect to where they were trying to go, or home
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await signIn({ email, password });
            if (error) throw error;
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            padding: '20px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: '800',
                    marginBottom: '16px',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1.1
                }}>
                    Malaysian Amateur<br />Radio Directory
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    The Modern "Yellow Pages" for Malaysian Amateur Radio Operators
                </p>
            </div>

            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{
                        marginTop: 0,
                        background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: '1.8rem'
                    }}>Restricted Access</h2>
                </div>

                <div style={{
                    background: 'rgba(255, 100, 100, 0.1)',
                    borderLeft: '4px solid #ff4444',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '25px',
                    fontSize: '0.9rem',
                    color: '#ffaaaa',
                    lineHeight: '1.5'
                }}>
                    <strong>🔒 Login Required</strong>
                    <br />
                    This directory contains sensitive personal information (including addresses and phone numbers). To protect our community's privacy, you must log in to view the listings.
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid #ff4444',
                        color: '#ff6666',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: loading ? 'var(--text-muted)' : '#000',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? <><FaSpinner className="spin" /> Signing In...</> : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
