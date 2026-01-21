import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { useAuth } from './AuthContext';
import { FaLock, FaEnvelope, FaSpinner, FaBroadcastTower } from 'react-icons/fa';
import PublicStats from './PublicStats';
import { useToast } from './Toast';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const turnstileRef = useRef();

    // Prevent body scroll on this page, but ensure content is scrollable if needed
    React.useEffect(() => {
        document.body.style.overflowY = 'auto'; // changed from hidden
        return () => {
            document.body.style.overflowY = 'unset';
        };
    }, []);

    // Redirect to where they were trying to go, or home
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!captchaToken) {
            setError("Please complete the security check");
            return;
        }

        setLoading(true);

        try {
            const { error } = await signIn({
                email,
                password,
                options: { captchaToken }
            });
            if (error) throw error;
            toast.success('Welcome back! Successfully logged in.');
            navigate('/', { replace: true }); // Always go to home after login
        } catch (err) {
            setError(err.message);
            setCaptchaToken('');
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100dvh', // Dynamic viewport height for mobile
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto', // Allow vertical scroll if content overflows
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <style>{`
                html, body { 
                    overflow-x: hidden !important; 
                    overflow-y: auto !important; 
                    height: 100% !important; 
                    margin: 0 !important; 
                    padding: 0 !important;
                    position: fixed;
                    width: 100%;
                }
                @media (max-height: 700px) {
                    .login-container { padding: 5px 10px !important; }
                    .header-section { margin-bottom: 2px !important; }
                    .header-section h1 { margin-bottom: 5px !important; }
                    .footer-section { margin-top: 5px !important; margin-bottom: 5px !important; }
                    .login-card { padding: 10px 15px !important; }
                    .badge-container { margin-bottom: 5px !important; }
                    .header-section p { display: none; } /* Hide subtext on very short screens */
                }
                @media (max-width: 400px) {
                    .header-section h1 { font-size: 1.1rem !important; }
                    .login-card { max-width: 98% !important; margin: 0 auto; }
                    .restricted-info { display: none; } /* Hide info box on narrow screens to save height */
                }
            `}</style>
            <div className="login-container" style={{
                margin: 'auto',
                padding: '10px 15px', // Further reduced padding
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100dvh'
            }}>
                <div className="header-section" style={{ textAlign: 'center', marginBottom: 'clamp(5px, 1vh, 8px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '3px' }}>
                        <img src="/logo.png" alt="MY-Callbook" style={{ height: '80px', width: '80px', borderRadius: '50%', marginBottom: '4px' }} />
                        <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: 'bold' }}>
                            MY-Callbook
                        </h2>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(0.9rem, 3vw, 1.3rem)',
                        fontWeight: '800',
                        marginBottom: '6px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.1
                    }}>
                        Malaysian Amateur<br />Radio Directory
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', maxWidth: '600px', margin: '0 auto 8px' }}>
                        Directory for Malaysian Amateur Radio Operators
                    </p>

                    <PublicStats />
                </div>

                <div className="glass-panel login-card" style={{
                    width: '100%',
                    maxWidth: '350px',
                    padding: 'clamp(10px, 2.5vw, 15px)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                        <h2 style={{
                            marginTop: 0,
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1rem',
                            marginBottom: '2px'
                        }}>Restricted Access</h2>
                    </div>

                    <div className="restricted-info" style={{
                        background: 'rgba(255, 100, 100, 0.1)',
                        borderLeft: '4px solid #ff4444',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        fontSize: '0.7rem',
                        color: '#ffaaaa',
                        lineHeight: '1.2'
                    }}>
                        Directory restricted. Please log in.
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255,0,0,0.1)',
                            border: '1px solid #ff4444',
                            color: '#ff6666',
                            padding: '6px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            fontSize: '0.8rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px', fontSize: '0.8rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                                <input
                                    type="email"
                                    inputMode="email"
                                    enterKeyHint="next"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px 8px 32px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.85rem'
                                    }}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px', fontSize: '0.8rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                                <input
                                    type="password"
                                    enterKeyHint="go"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px 8px 32px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.85rem'
                                    }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '2px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Turnstile / Captcha */}
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', transform: 'scale(0.85)' }}>
                            <Turnstile
                                ref={turnstileRef}
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
                                padding: '10px',
                                background: loading
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: loading ? 'var(--text-muted)' : '#000',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'wait' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {loading ? <><FaSpinner className="spin" /> Signing In...</> : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </div>
                </div>
                <div className="footer-section" style={{ marginTop: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    <p style={{ margin: '0 0 2px 0' }}>&copy; 2026 Malaysian Amateur Radio Callbook</p>
                    <p style={{ margin: 0 }}>
                        Made for 🇲🇾 by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>9M2PJU</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
