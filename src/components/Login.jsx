import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaLock, FaEnvelope, FaSpinner, FaBroadcastTower } from 'react-icons/fa';
import PublicStats from './PublicStats';

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
                padding: '20px', // Reduced outer padding
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(15px, 3vh, 30px)' }}> {/* Reduced margin */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        <FaBroadcastTower size={28} color="var(--primary)" /> {/* Slightly smaller icon */}
                        <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 'bold' }}>
                            MY-Callbook
                        </h2>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', // Reduced max size
                        fontWeight: '800',
                        marginBottom: '10px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.1
                    }}>
                        Malaysian Amateur<br />Radio Directory
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', maxWidth: '600px', margin: '0 auto 20px' }}>
                        The Modern "Yellow Pages" for Malaysian Amateur Radio Operators
                    </p>

                    <PublicStats />
                </div>

                <div className="glass-panel" style={{
                    width: '100%',
                    maxWidth: '400px', // Slightly narrower
                    padding: 'clamp(20px, 4vw, 30px)' // Reduced padding
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2 style={{
                            marginTop: 0,
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1.5rem' // Reduced size
                        }}>Restricted Access</h2>
                    </div>

                    <div style={{
                        background: 'rgba(255, 100, 100, 0.1)',
                        borderLeft: '4px solid #ff4444',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        fontSize: '0.85rem', // Smaller text
                        color: '#ffaaaa',
                        lineHeight: '1.4'
                    }}>
                        <strong>🔒 Login Required</strong>
                        <br />
                        Directory contains sensitive personal info. Please log in to view.
                    </div>

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
                                        padding: '10px 10px 10px 35px', // More compact
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

                        <div style={{ marginBottom: '25px' }}>
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
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
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

                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </div>
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <p style={{ margin: '0 0 5px 0' }}>&copy; 2026 Malaysian Amateur Radio Callbook</p>
                    <p style={{ margin: 0 }}>
                        Made for 🇲🇾 by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>9M2PJU</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
