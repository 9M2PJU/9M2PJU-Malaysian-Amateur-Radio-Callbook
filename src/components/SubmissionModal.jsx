import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';

import { MALAYSIAN_STATES, MALAYSIAN_DISTRICTS } from '../constants';

const SubmissionModal = ({ isOpen, onClose, initialData = null }) => {
    const toast = useToast();
    const { user, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        callsign: '',
        name: '',
        location: '',
        email: '',
        phone: '',
        telegramUsername: '',
        address: '',
        website: '',
        facebook: '',
        qrz: '',
        dmrId: '',
        martsId: '',
        meshtasticId: '',
        district: '',
        gridLocator: '',
        aprsCallsign: '',
        expiryDate: '',
        telegramChatId: '',
        botField: '', // Honeypot
        isPpmMember: false,
        isBsmmMember: false,
        isPppmMember: false,
        isVeteran: false,
    });
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');



    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit Mode
                setFormData({
                    callsign: initialData.callsign || '',
                    name: initialData.name || '',
                    location: initialData.location || '',
                    email: initialData.email || '',
                    phone: initialData.phone || '',
                    telegramUsername: initialData.telegramUsername || '',
                    address: initialData.address || '',
                    website: initialData.website || '',
                    facebook: initialData.facebook || '',
                    qrz: initialData.qrz || '',
                    dmrId: initialData.dmrId || '',
                    martsId: initialData.martsId || '',
                    meshtasticId: initialData.meshtasticId || '',
                    district: initialData.district || '',
                    gridLocator: initialData.gridLocator || '',
                    aprsCallsign: initialData.aprsCallsign || '',
                    expiryDate: initialData.expiryDate || '',
                    telegramChatId: initialData.telegramChatId || '',
                    isPpmMember: initialData.isPpmMember || false,
                    isBsmmMember: initialData.isBsmmMember || false,
                    isPppmMember: initialData.isPppmMember || false,
                    isVeteran: initialData.isVeteran || false,
                    botField: ''
                });

                setIsCaptchaVerified(true); // Skip captcha for editing
            } else {
                setFormData(prev => ({
                    ...prev,
                    botField: '',
                    email: user?.email || '' // Auto-fill email from auth
                }));

                setIsCaptchaVerified(false);
            }
        }
    }, [isOpen, user, initialData]);

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

    // State for Telegram test button
    const [testingTelegram, setTestingTelegram] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-uppercase specific fields
        if (name === 'callsign' || name === 'aprsCallsign' || name === 'name' || name === 'address' || name === 'gridLocator') {
            value = value.toUpperCase();
        }

        // Numeric only fields
        if (name === 'martsId' || name === 'dmrId') {
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                return; // Ignore non-numeric input
            }
        }

        // Reset district if location (state) changes
        if (name === 'location') {
            setFormData(prev => ({ ...prev, [name]: value, district: '' }));
        } else if (['isPpmMember', 'isBsmmMember', 'isPppmMember', 'isVeteran'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: e.target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle Telegram test message
    const handleTestTelegram = async () => {
        if (!formData.telegramChatId) {
            toast.error("Please enter a Telegram Chat ID first");
            return;
        }

        setTestingTelegram(true);
        try {
            const { data, error } = await supabase.functions.invoke('telegram-test-message', {
                body: { chat_id: formData.telegramChatId }
            });

            if (error) throw error;

            toast.success("Test message sent! Check your Telegram.");
        } catch (err) {
            console.error("Test Telegram Error:", err);
            toast.error("Failed to send test message. Check the ID and try again.");
        } finally {
            setTestingTelegram(false);
        }
    };

    const validateCallsign = (callsign) => {
        // Allow Malaysian callsigns: 9M or 9W followed by numbers and letters
        // Examples: 9M2ABC, 9W2XYZ, 9M4IOTA, 9M59MY, 9M2PJU
        const regex = /^9[MW][0-9][A-Z0-9]{1,6}$/i;
        return regex.test(callsign.toUpperCase());
    };

    // Auto-add https:// if user enters plain domain
    // Security: Block dangerous URI schemes
    const normalizeUrl = (url) => {
        if (!url || url.trim() === '') return null;
        url = url.trim();

        // Block dangerous URI schemes (XSS prevention)
        if (/^(javascript|data|vbscript):/i.test(url)) {
            console.warn('Blocked dangerous URL scheme:', url);
            return null;
        }

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

            if (existing && !initialData) {
                // BLOCK DUPLICATE SUBMISSION ONLY IF NOT EDITING
                throw new Error("⛔ Callsign already exists! To update your details, please email 9m2pju@hamradio.my");
            } else if (initialData) {
                // UPDATE EXISTING ENTRY
                let query = supabase
                    .from('callsigns')
                    .update({
                        callsign: formData.callsign.toUpperCase(), // Allow updating callsign
                        name: formData.name.toUpperCase(),
                        location: formData.location,
                        email: formData.email || null,
                        phone: formData.phone || null,
                        telegram_username: formData.telegramUsername || null,
                        address: formData.address || null,
                        website: normalizeUrl(formData.website),
                        facebook: normalizeUrl(formData.facebook),
                        qrz: normalizeUrl(formData.qrz),
                        dmr_id: formData.dmrId || null,
                        marts_id: formData.martsId || null,
                        meshtastic_id: formData.meshtasticId || null,
                        district: formData.district || null,
                        grid_locator: formData.gridLocator || null,
                        aprs_callsign: formData.aprsCallsign || null,
                        expiry_date: formData.expiryDate || null,
                        telegram_chat_id: formData.telegramChatId || null,
                        is_ppm_member: formData.isPpmMember,
                        is_bsmm_member: formData.isBsmmMember,
                        is_pppm_member: formData.isPppmMember,
                        is_veteran: formData.isVeteran,
                        updated_at: new Date().toISOString()
                    });

                // Use ID if available (more robust), otherwise fallback to original callsign
                if (initialData.id) {
                    query = query.eq('id', initialData.id);
                } else {
                    query = query.eq('callsign', initialData.callsign); // match ORIGINAL callsign
                }

                // Security: Ensure ownership UNLESS ADMIN
                if (!isAdmin) {
                    query = query.eq('user_id', user.id);
                }

                const { error: updateError } = await query;

                if (updateError) throw updateError;
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
                        telegram_username: formData.telegramUsername || null,
                        address: formData.address || null,
                        website: normalizeUrl(formData.website),
                        facebook: normalizeUrl(formData.facebook),
                        qrz: normalizeUrl(formData.qrz),
                        dmr_id: formData.dmrId || null,
                        marts_id: formData.martsId || null,
                        meshtastic_id: formData.meshtasticId || null,
                        district: formData.district || null,
                        grid_locator: formData.gridLocator || null,
                        aprs_callsign: formData.aprsCallsign || null,
                        expiry_date: formData.expiryDate || null,
                        telegram_chat_id: formData.telegramChatId || null,
                        is_ppm_member: formData.isPpmMember,
                        is_bsmm_member: formData.isBsmmMember,
                        is_pppm_member: formData.isPppmMember,
                        is_veteran: formData.isVeteran,
                        added_date: new Date().toISOString().split('T')[0],
                        user_id: user?.id || null // Link to auth user
                    });

                if (insertError) throw insertError;
            }

            setSuccess(true);
            const action = initialData ? 'updated' : 'added';
            toast.success(`Callsign ${formData.callsign.toUpperCase()} ${action} successfully!`);
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    callsign: '', name: '', location: '', email: '',
                    phone: '', address: '', website: '', facebook: '', qrz: ''
                });
                onClose(true); // Signal to parent that update happened
            }, 1500);

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

                <h2 style={{ color: 'var(--primary)', marginTop: 0 }}>
                    {initialData ? '✏️ Edit Callsign' : '📻 Register Your Callsign'}
                </h2>

                {success ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#00c853'
                    }}>
                        <FaCheckCircle size={60} />
                        <h3>Submission Successful!</h3>
                        <p>Your callsign has been {initialData ? 'updated' : 'added'} successfully.</p>
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
                            <label style={labelStyle}>License Expiry Date *</label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />

                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Telegram Chat ID (Optional)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    name="telegramChatId"
                                    value={formData.telegramChatId}
                                    onChange={handleChange}
                                    placeholder="e.g. 123456789"
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={handleTestTelegram}
                                    disabled={!formData.telegramChatId || testingTelegram}
                                    title="Send a test message to verify your Chat ID"
                                    style={{
                                        padding: '0 16px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        color: 'var(--primary)',
                                        fontWeight: '600',
                                        cursor: (!formData.telegramChatId || testingTelegram) ? 'not-allowed' : 'pointer',
                                        opacity: (!formData.telegramChatId || testingTelegram) ? 0.5 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (formData.telegramChatId && !testingTelegram) {
                                            e.currentTarget.style.background = 'rgba(79, 172, 254, 0.2)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    {testingTelegram ? <FaSpinner className="spin" /> : 'Test'}
                                </button>
                            </div>
                            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px', lineHeight: '1.5', fontSize: '0.85rem' }}>
                                <div style={{ marginBottom: '8px', color: '#81e6d9' }}>
                                    🔔 <strong>Why add this?</strong> You will receive automated reminders via Telegram when your license is about to expire.
                                </div>
                                <strong style={{ color: 'var(--secondary)' }}>How to get your numeric Chat ID:</strong><br />
                                1. <a
                                    href="https://t.me/MYHamRadioCallbookBot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline' }}
                                >
                                    Click here to open @MYHamRadioCallbookBot
                                </a><br />
                                2. In Telegram, tap <strong>START</strong> (or type <code>/start</code>).<br />
                                3. The bot will reply with your ID. Copy that number and paste it here.
                            </small>
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
                            <label style={labelStyle}>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
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
                            <label style={labelStyle}>District *</label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                style={{ ...inputStyle, cursor: formData.location ? 'pointer' : 'not-allowed' }}
                                disabled={!formData.location}
                                required
                            >
                                <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>
                                    {formData.location ? 'Select District' : 'Select State First'}
                                </option>
                                {formData.location && MALAYSIAN_DISTRICTS[formData.location]?.map(dist => (
                                    <option key={dist} value={dist} style={{ background: '#1a1a1a', color: '#fff' }}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Grid Locator (Maidenhead) (Optional)</label>
                            <input
                                type="text"
                                name="gridLocator"
                                value={formData.gridLocator}
                                onChange={handleChange}
                                placeholder="e.g. OJ03"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>APRS Callsign (Optional)</label>
                            <input
                                type="text"
                                name="aprsCallsign"
                                value={formData.aprsCallsign}
                                onChange={handleChange}
                                placeholder="e.g. 9M2PJU-9"
                                style={inputStyle}
                            />
                            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                Specify callsign with SSID (eg -9 for mobile)
                            </small>
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
                            <label style={labelStyle}>Telegram Username (Optional)</label>
                            <input
                                type="text"
                                name="telegramUsername"
                                value={formData.telegramUsername}
                                onChange={handleChange}
                                placeholder="@yourusername"
                                style={inputStyle}
                            />
                            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                Your Telegram username (with or without @)
                            </small>
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

                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <input
                                type="checkbox"
                                name="isPpmMember"
                                id="isPpmMember"
                                checked={formData.isPpmMember}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isPpmMember" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', lineHeight: '1.4' }}>
                                Are you a registered Scout member of <strong>Persekutuan Pengakap Malaysia (PPM)</strong>?
                            </label>
                        </div>

                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <input
                                type="checkbox"
                                name="isBsmmMember"
                                id="isBsmmMember"
                                checked={formData.isBsmmMember}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isBsmmMember" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', lineHeight: '1.4' }}>
                                Are you a registered member of <strong>Malaysian Red Crescent (BSMM)</strong>?
                            </label>
                        </div>

                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <input
                                type="checkbox"
                                name="isPppmMember"
                                id="isPppmMember"
                                checked={formData.isPppmMember}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isPppmMember" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', lineHeight: '1.4' }}>
                                Are you a registered member of <strong>Persatuan Pandu Puteri Malaysia (PPPM)</strong>?
                            </label>
                        </div>

                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <input
                                type="checkbox"
                                name="isVeteran"
                                id="isVeteran"
                                checked={formData.isVeteran}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isVeteran" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', lineHeight: '1.4' }}>
                                Are you a <strong>Malaysian Armed Forces Veteran (ATM Veteran)</strong>?
                            </label>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Meshtastic Node ID (Optional)</label>
                            <input
                                type="text"
                                name="meshtasticId"
                                value={formData.meshtasticId}
                                onChange={handleChange}
                                placeholder="e.g. !a1b2c3d4"
                                style={inputStyle}
                            />
                            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                Your Meshtastic device node ID (starts with !)
                            </small>
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
                                initialData ? 'Update Callsign' : 'Submit Registration'
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
                                To <strong>update</strong> or <strong>delete</strong> your info, please go to <strong>My Callsigns</strong>.
                                <br />
                                If you encounter any problems, please email: <a href="mailto:9m2pju@hamradio.my" style={{ color: 'var(--primary)' }}>9m2pju@hamradio.my</a>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubmissionModal;
