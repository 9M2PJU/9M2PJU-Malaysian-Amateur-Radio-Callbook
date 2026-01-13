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
            <style>{`
                @media (max-height: 700px) {
                    .login-container { padding: 10px !important; }
                    .header-section { margin-bottom: 10px !important; }
                    .footer-section { margin-top: 15px !important; }
                    .login-card { padding: 15px !important; }
                }
            `}</style>
            <div className="login-container" style={{
                margin: 'auto',
                padding: '20px', // Reduced outer padding
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="header-section" style={{ textAlign: 'center', marginBottom: 'clamp(5px, 1.5vh, 15px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
                        <FaBroadcastTower size={24} color="var(--primary)" />
                        <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 'bold' }}>
                            MY-Callbook
                        </h2>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.3rem, 4.5vw, 2rem)',
                        fontWeight: '800',
                        marginBottom: '10px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.1
                    }}>
                        Malaysian Amateur<br />Radio Directory
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 2.2vw, 1rem)', maxWidth: '600px', margin: '0 auto 15px' }}>
                        Directory for Malaysian Amateur Radio Operators
                    </p>

                    <PublicStats />
                </div>

                <div className="glass-panel login-card" style={{
                    width: '100%',
                    maxWidth: '380px',
                    padding: 'clamp(15px, 3vw, 25px)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h2 style={{
                            marginTop: 0,
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1.2rem',
                            marginBottom: '5px'
                        }}>Restricted Access</h2>
                    </div>

                    <div style={{
                        background: 'rgba(255, 100, 100, 0.1)',
                        borderLeft: '4px solid #ff4444',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '0.8rem',
                        color: '#ffaaaa',
                        lineHeight: '1.3'
                    }}>
                        Directory contains sensitive data. Please log in.
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
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.85rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px 8px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.85rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px 8px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.9rem'
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
                <div className="footer-section" style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <p style={{ margin: '0 0 4px 0' }}>&copy; 2026 Malaysian Amateur Radio Callbook</p>
                    <p style={{ margin: 0 }}>
                        Made by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>9M2PJU</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
