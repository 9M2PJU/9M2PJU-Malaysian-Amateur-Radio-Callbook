import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
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
            height: '100dvh', // Forced height for both mobile and desktop
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            overflow: 'hidden'
        }}>
            <style>{`
                /* Global Defaults */
                html, body { 
                    overflow: hidden !important; 
                    height: 100% !important; 
                    margin: 0 !important; 
                    padding: 0 !important;
                    width: 100%;
                    overscroll-behavior: none; /* Prevent pull-to-refresh */
                }

                /* Mobile & Small Screen Optimization */
                @media (max-width: 768px), (max-height: 700px) {
                    .main-wrapper {
                        height: 100% !important;
                        min-height: 0 !important;
                        padding: 10px 0 !important;
                        overflow: hidden !important;
                        justify-content: flex-start !important;
                    }
                    
                    .login-container {
                        padding: 0 15px !important;
                        justify-content: flex-start !important;
                        gap: 0 !important;
                    }
                    
                    /* Compact Logo */
                    .logo-img {
                        width: 60px !important;
                        height: 60px !important;
                        display: block !important; 
                        opacity: 1 !important;
                        margin-bottom: 0 !important;
                    }

                    /* Compact Header */
                    .header-section {
                        margin-bottom: 5px !important;
                    }
                    .header-section h1 {
                        font-size: 1rem !important;
                        margin-bottom: 0 !important;
                        line-height: 1.1 !important;
                    }
                    .header-section h2 {
                        font-size: 0.95rem !important;
                        margin: 0 !important;
                    }
                    /* Hide subtitle on mobile */
                    .header-section > p {
                        display: none !important;
                    }
                    
                    /* Hide PublicStats on mobile to save space */
                    .header-section > div:last-child {
                        display: none !important;
                    }

                    /* Compact Card */
                    .login-card { 
                        padding: 12px 15px !important;
                        margin: 5px auto !important;
                        width: 100% !important;
                        max-width: none !important;
                    }
                    .login-card h2 {
                        font-size: 1rem !important;
                        margin-bottom: 0 !important;
                    }
                    
                    /* Compact Form Elements */
                    .login-card label { margin-bottom: 2px !important; font-size: 0.75rem !important; }
                    .login-card input { padding: 8px 10px 8px 30px !important; font-size: 0.85rem !important; }
                    .login-card .turnstile-wrapper {
                        transform: scale(0.7);
                        transform-origin: center;
                        margin: 0 !important;
                        min-height: 50px !important;
                    }
                    .login-card button { padding: 8px !important; font-size: 0.9rem !important; }
                    
                    .restricted-info { display: none !important; }
                    
                    .footer-section { 
                        margin-top: 5px !important;
                        font-size: 0.65rem !important; 
                    }
                    .footer-section p { margin: 0 !important; }
                }
            `}</style>

            <div className="main-wrapper" style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div className="login-container" style={{
                    margin: '0 auto',
                    padding: '0 20px',
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%', // Take full height to allow uniform spacing
                    maxHeight: '100dvh'
                }}>
                    <div className="header-section" style={{ textAlign: 'center', marginBottom: 'clamp(5px, 2vh, 15px)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
                            <img
                                src="/logo.png"
                                alt="MY-Callbook"
                                className="logo-img"
                                style={{
                                    height: 'clamp(100px, 12vh, 140px)', // Responsive height
                                    width: 'clamp(100px, 12vh, 140px)',
                                    borderRadius: '50%',
                                    marginBottom: '5px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            <h2 style={{
                                margin: 0,
                                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                                fontWeight: 'bold',
                                letterSpacing: '-0.5px'
                            }}>
                                MY-Callbook
                            </h2>
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                            fontWeight: '800',
                            marginBottom: '5px',
                            background: 'linear-gradient(to right, #fff, #cbd5e1)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            lineHeight: 1.2
                        }}>
                            Malaysian Amateur<br />Radio Directory
                        </h1>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                            maxWidth: '700px',
                            margin: '0 auto 10px'
                        }}>
                            Directory for Malaysian Amateur Radio Operators
                        </p>

                        <div style={{ transform: 'scale(0.95)' }}>
                            <PublicStats />
                        </div>
                    </div>

                    <div className="glass-panel login-card" style={{
                        width: '100%',
                        maxWidth: '420px', // Slightly tighter
                        padding: '25px', // Optimized padding
                        marginTop: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <h2 style={{
                                marginTop: 0,
                                background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: '1.3rem',
                                marginBottom: '2px',
                                fontWeight: '700'
                            }}>Restricted Access</h2>
                        </div>

                        <div className="restricted-info" style={{
                            background: 'rgba(255, 100, 100, 0.1)',
                            borderLeft: '4px solid #ff4444',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            fontSize: '0.85rem',
                            color: '#ffaaaa',
                            lineHeight: '1.3'
                        }}>
                            Directory restricted. Please log in to continue.
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
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.85rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <FaEnvelope style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                                    <input
                                        type="email"
                                        inputMode="email"
                                        enterKeyHint="next"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px 10px 38px',
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
                                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.85rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                                    <input
                                        type="password"
                                        enterKeyHint="go"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px 10px 38px',
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
                                    <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Turnstile / Captcha */}
                            <div
                                className="turnstile-wrapper"
                                style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    minHeight: '65px',
                                    alignItems: 'center'
                                }}
                            >
                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey="0x4AAAAAACM4A9z-qhrcwAcp"
                                    onSuccess={setCaptchaToken}
                                    theme="dark"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1.05rem',
                                    justifyContent: 'center',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? <><FaSpinner className="spin" /> Signing In...</> : 'Sign In'}
                            </button>
                        </form>

                        <div style={{ marginTop: '15px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                                Register
                            </Link>
                        </div>
                    </div>
                    <div className="footer-section" style={{ marginTop: '15px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <p style={{ margin: '0 0 4px 0' }}>&copy; 2026 Malaysian Amateur Radio Callbook</p>
                        <p style={{ margin: 0 }}>
                            Made for 🇲🇾 by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>9M2PJU</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
