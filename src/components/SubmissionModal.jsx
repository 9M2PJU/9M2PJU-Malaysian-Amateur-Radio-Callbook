import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const MALAYSIAN_STATES = [
    'JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI SEMBILAN',
    'PAHANG', 'PERAK', 'PERLIS', 'PULAU PINANG', 'SABAH',
    'SARAWAK', 'SELANGOR', 'TERENGGANU', 'KUALA LUMPUR', 'LABUAN', 'PUTRAJAYA'
];

const SubmissionModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        callsign: '',
        name: '',
        location: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        facebook: '',
        qrz: '',
        dmrId: '',
        martsId: '',
        botField: '', // Honeypot
    });
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, botField: '' }));
            setIsCaptchaVerified(false);
        }
    }, [isOpen]);

    // Handle Altcha verification
    useEffect(() => {
        const handleStateChange = (ev) => {
            if (ev.detail.state === 'verified') {
                setIsCaptchaVerified(true);
            }
        };

        const widget = document.querySelector('altcha-widget');
        if (widget) {
            widget.addEventListener('statechange', handleStateChange);
            return () => widget.removeEventListener('statechange', handleStateChange);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-uppercase specific fields
        if (name === 'callsign' || name === 'name' || name === 'address') {
            value = value.toUpperCase();
        }

        // Numeric only fields
        if (name === 'martsId' || name === 'dmrId') {
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                return; // Ignore non-numeric input
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateCallsign = (callsign) => {
        // Allow Malaysian callsigns: 9M or 9W followed by numbers and letters
        // Examples: 9M2ABC, 9W2XYZ, 9M4IOTA, 9M59MY, 9M2PJU
        const regex = /^9[MW][0-9][A-Z0-9]{1,6}$/i;
        return regex.test(callsign.toUpperCase());
    };

    // Auto-add https:// if user enters plain domain
    const normalizeUrl = (url) => {
        if (!url || url.trim() === '') return null;
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Spam Check 1: Honeypot
        if (formData.botField) {
            console.log("Bot detected (honeypot)");
            return; // Silently fail
        }

        // Spam Check 2: Altcha
        if (!isCaptchaVerified) {
            setError('Please verify you are not a robot.');
            return;
        }

        // Validate callsign
        if (!validateCallsign(formData.callsign)) {
            setError('Invalid callsign format. Must be Malaysian format (e.g., 9M2ABC, 9W2XYZ)');
            return;
        }

        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        if (!formData.location) {
            setError('Please select your state');
            return;
        }

        setSubmitting(true);

        try {
            // Check if callsign already exists
            const { data: existing } = await supabase
                .from('callsigns')
                .select('callsign')
                .eq('callsign', formData.callsign.toUpperCase())
                .single();

            if (existing) {
                // BLOCK DUPLICATE SUBMISSION
                throw new Error("⛔ Callsign already exists! To update your details, please email 9m2pju@hamradio.my");
            } else {
                // Insert new entry
                const { error: insertError } = await supabase
                    .from('callsigns')
                    .insert({
                        callsign: formData.callsign.toUpperCase(),
                        name: formData.name.toUpperCase(),
                        location: formData.location,
                        email: formData.email || null,
                        phone: formData.phone || null,
                        address: formData.address || null,
                        website: normalizeUrl(formData.website),
                        facebook: normalizeUrl(formData.facebook),
                        qrz: normalizeUrl(formData.qrz),
                        dmr_id: formData.dmrId || null,
                        marts_id: formData.martsId || null,
                        added_date: new Date().toISOString().split('T')[0]
                    });

                if (insertError) throw insertError;
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    callsign: '', name: '', location: '', email: '',
                    phone: '', address: '', website: '', facebook: '', qrz: ''
                });
                onClose();
                window.location.reload(); // Refresh to show new data
            }, 2000);

        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
    };

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

                <h2 style={{ color: 'var(--primary)', marginTop: 0 }}>📻 Register Your Callsign</h2>

                {success ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#00c853'
                    }}>
                        <FaCheckCircle size={60} />
                        <h3>Submission Successful!</h3>
                        <p>Your callsign has been added to the directory.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                background: 'rgba(255,0,0,0.1)',
                                border: '1px solid #ff4444',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '20px',
                                color: '#ff6666'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Callsign *</label>
                            <input
                                type="text"
                                name="callsign"
                                value={formData.callsign}
                                onChange={handleChange}
                                placeholder="9M2ABC"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="AHMAD BIN ALI"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>State *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                required
                            >
                                <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>Select State</option>
                                {MALAYSIAN_STATES.map(state => (
                                    <option key={state} value={state} style={{ background: '#1a1a1a', color: '#fff' }}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Email (Optional)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Phone (Optional)</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+60123456789"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Address (Optional)</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123, Jalan Radio, 50000 Kuala Lumpur"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Website (Optional)</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="example.com or https://example.com"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Facebook (Optional)</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                placeholder="facebook.com/yourprofile"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>QRZ.com Profile (Optional)</label>
                            <input
                                type="text"
                                name="qrz"
                                value={formData.qrz}
                                onChange={handleChange}
                                placeholder="qrz.com/db/9M2ABC"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>DMR ID (Optional)</label>
                            <input
                                type="text"
                                name="dmrId"
                                value={formData.dmrId}
                                onChange={handleChange}
                                placeholder="5020XXX"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>MARTS MEMBER ID (Optional)</label>
                            <input
                                type="text"
                                name="martsId"
                                value={formData.martsId}
                                onChange={handleChange}
                                placeholder="xxxx"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Security Check</label>
                            <altcha-widget
                                challengeurl="/api/challenge"
                                style={{ width: '100%' }}
                            ></altcha-widget>
                        </div>

                        {/* Honeypot field - hidden from humans */}
                        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                            <label>Ignore this field</label>
                            <input
                                type="text"
                                name="botField"
                                value={formData.botField}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: submitting
                                    ? 'rgba(79, 172, 254, 0.5)'
                                    : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#000',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            {submitting ? (
                                <>
                                    <FaSpinner className="spin" /> Submitting...
                                </>
                            ) : (
                                'Submit Registration'
                            )}
                        </button>

                        {/* Privacy Warning */}
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: 'rgba(255, 100, 100, 0.1)',
                            borderLeft: '4px solid #ff4444',
                            borderRadius: '4px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4444', fontWeight: 'bold', marginBottom: '8px' }}>
                                <FaExclamationTriangle /> Privacy Warning
                            </div>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#ffaaaa' }}>
                                <strong>By clicking Submit, you understand and agree that:</strong>
                            </p>
                            <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px', fontSize: '0.85rem', color: '#ffaaaa', lineHeight: '1.6' }}>
                                <li>All information you provide will be <strong>publicly visible</strong> to everyone on the internet</li>
                                <li>Your data will be stored in our database and displayed on this website</li>
                                <li>The maintainer is not responsible for any privacy breach or misuse of published information</li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            background: 'rgba(79, 172, 254, 0.1)',
                            borderLeft: '4px solid var(--primary)',
                            borderRadius: '4px'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                To <strong>update</strong> or <strong>delete</strong> your info, this form will not work.
                                Please email: <a href="mailto:9m2pju@hamradio.my" style={{ color: 'var(--primary)' }}>9m2pju@hamradio.my</a>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubmissionModal;
