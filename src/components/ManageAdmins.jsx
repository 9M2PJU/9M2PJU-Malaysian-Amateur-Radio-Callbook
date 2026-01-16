import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaUserShield, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';

const ManageAdmins = () => {
    const { user, isSuperAdmin, isAdmin } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Donator management states
    const [donators, setDonators] = useState([]);
    const [donatorsLoading, setDonatorsLoading] = useState(false);
    const [donatorCallsign, setDonatorCallsign] = useState('');
    const [donatorCallsignId, setDonatorCallsignId] = useState(''); // Store the callsign ID
    const [donatorCallsignData, setDonatorCallsignData] = useState(null); // Store full callsign data
    const [donatorNote, setDonatorNote] = useState('');
    const [donatorAdding, setDonatorAdding] = useState(false);
    const [lookingUp, setLookingUp] = useState(false);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins();
        }
        if (isAdmin) {
            fetchDonators();
        }
    }, [isSuperAdmin, isAdmin]);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAdmins(data || []);
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newEmail.trim()) {
            setError('Please enter an email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        setAdding(true);

        try {
            const { error } = await supabase
                .from('admins')
                .insert({
                    email: newEmail.toLowerCase().trim(),
                    created_by: user?.email
                });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('This email is already an admin');
                }
                throw error;
            }

            setSuccess(`${newEmail} has been added as an admin`);
            setNewEmail('');
            fetchAdmins();
        } catch (err) {
            console.error('Error adding admin:', err);
            setError(err.message || 'Failed to add admin');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAdmin = async (adminEmail) => {
        if (!window.confirm(`Are you sure you want to remove ${adminEmail} as an admin?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('admins')
                .delete()
                .eq('email', adminEmail);

            if (error) throw error;

            setSuccess(`${adminEmail} has been removed as an admin`);
            fetchAdmins();
        } catch (err) {
            console.error('Error removing admin:', err);
            setError('Failed to remove admin');
        }
    };

    // Donator Management Functions
    const fetchDonators = async () => {
        try {
            setDonatorsLoading(true);
            const { data, error } = await supabase
                .from('user_profiles')
                .select(`
                    *,
                    callsigns(id, callsign, name, email)
                `)
                .eq('is_donator', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDonators(data || []);
        } catch (err) {
            console.error('Error fetching donators:', err);
            setError('Failed to load donators');
        } finally {
            setDonatorsLoading(false);
        }
    };

    const handleLookupCallsign = async () => {
        if (!donatorCallsign.trim()) return;

        setLookingUp(true);
        setError('');

        try {
            const { data, error } = await supabase
                .from('callsigns')
                .select('id, email, callsign, name')
                .ilike('callsign', donatorCallsign.trim())
                .single();

            if (error || !data) {
                setError(`Callsign ${donatorCallsign} not found in database`);
                setDonatorCallsignId('');
                setDonatorCallsignData(null);
                return;
            }

            setDonatorCallsignId(data.id);
            setDonatorCallsignData(data);
            setSuccess(`Found: ${data.name} (${data.callsign})${data.email ? ` - ${data.email}` : ''}`);
        } catch (err) {
            console.error('Error looking up callsign:', err);
            setError('Failed to lookup callsign');
        } finally {
            setLookingUp(false);
        }
    };

    const handleAddDonator = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!donatorCallsignId) {
            setError('Please lookup a callsign first');
            return;
        }

        setDonatorAdding(true);

        try {
            // Check if this callsign already has a donator badge
            const { data: existing } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('callsign_id', donatorCallsignId)
                .single();

            if (existing) {
                // Update existing profile
                const { error } = await supabase
                    .from('user_profiles')
                    .update({
                        is_donator: true,
                        donator_note: donatorNote.trim() || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('callsign_id', donatorCallsignId);

                if (error) throw error;
            } else {
                // Create new profile for this callsign
                const { error } = await supabase
                    .from('user_profiles')
                    .insert({
                        callsign_id: donatorCallsignId,
                        email: donatorCallsignData?.email || null,
                        is_donator: true,
                        donator_note: donatorNote.trim() || null
                    });

                if (error) throw error;
            }

            setSuccess(`Donator badge added to ${donatorCallsignData?.callsign}`);
            setDonatorCallsign('');
            setDonatorCallsignId('');
            setDonatorCallsignData(null);
            setDonatorNote('');
            fetchDonators();
        } catch (err) {
            console.error('Error adding donator:', err);
            setError(err.message || 'Failed to add donator');
        } finally {
            setDonatorAdding(false);
        }
    };

    const handleRemoveDonator = async (callsignId) => {
        const donator = donators.find(d => d.callsign_id === callsignId);
        if (!window.confirm(`Are you sure you want to remove donator badge from ${donator?.callsigns?.callsign || 'this callsign'}?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    is_donator: false,
                    updated_at: new Date().toISOString()
                })
                .eq('callsign_id', callsignId);

            if (error) throw error;

            setSuccess(`Donator badge removed from ${donator?.callsigns?.callsign || 'callsign'}`);
            fetchDonators();
        } catch (err) {
            console.error('Error removing donator:', err);
            setError('Failed to remove donator badge');
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="container" style={{ minHeight: '80vh', padding: '40px 20px', textAlign: 'center' }}>
                    <h1 style={{ color: '#ff4444' }}>Access Denied</h1>
                    <p style={{ color: 'var(--text-muted)' }}>You do not have permission to access this page.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container" style={{ minHeight: '80vh', padding: '20px' }}>
                <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <FaUserShield /> Admin Management
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isSuperAdmin ?
                            'Add or remove administrators who can edit any callsign.' :
                            'Only super admin can manage administrators. You can manage donator badges below.'
                        }
                    </p>
                </div>

                {/* Add Admin Form - Super Admin Only */}
                {isSuperAdmin && (
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', maxWidth: '500px' }}>
                        <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>Add New Admin</h3>

                        {error && (
                            <div style={{
                                background: 'rgba(255, 0, 0, 0.1)',
                                border: '1px solid #ff4444',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px',
                                color: '#ff6666'
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid #22c55e',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px',
                                color: '#22c55e'
                            }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="admin@example.com"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={adding}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    cursor: adding ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {adding ? <FaSpinner className="spin" /> : <FaPlus />}
                                Add
                            </button>
                        </form>
                    </div>
                )}

                {/* Admin List - Super Admin Only */}
                {isSuperAdmin && (
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>
                            Current Admins ({admins.length})
                        </h3>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <FaSpinner className="spin" /> Loading...
                            </div>
                        ) : admins.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No admins added yet. Add an admin above.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {admins.map((admin) => (
                                    <div
                                        key={admin.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '16px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: '500' }}>{admin.email}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                Added {new Date(admin.created_at).toLocaleDateString()}
                                                {admin.created_by && ` by ${admin.created_by}`}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveAdmin(admin.email)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                                color: '#ef4444',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <FaTrash /> Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Info Box */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <strong>Admin Permissions:</strong> Admins can edit any callsign in the directory.<br />
                        <strong>Super Admin:</strong> Only you (9m2pju@hamradio.my) can delete callsigns and manage admins.
                    </p>
                </div>

                {/* Donator Management Section */}
                <div style={{ marginTop: '60px' }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        background: 'linear-gradient(to right, #ffd700, #ffb347)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        ❤️ Manage Donators
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Assign donator badges to users who have contributed to the project.
                    </p>

                    {/* Add Donator Form */}
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', maxWidth: '600px' }}>
                        <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>Add Donator Badge</h3>

                        <form onSubmit={handleAddDonator} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Callsign Lookup */}
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                                    Search by Callsign
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={donatorCallsign}
                                        onChange={(e) => setDonatorCallsign(e.target.value.toUpperCase())}
                                        placeholder="e.g. 9M2PJU"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleLookupCallsign();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleLookupCallsign}
                                        disabled={lookingUp || !donatorCallsign.trim()}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'rgba(79, 172, 254, 0.2)',
                                            border: '1px solid var(--primary)',
                                            borderRadius: '8px',
                                            color: 'var(--primary)',
                                            fontWeight: '600',
                                            cursor: lookingUp ? 'wait' : 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {lookingUp ? <FaSpinner className="spin" /> : '🔍 Lookup'}
                                    </button>
                                </div>
                            </div>

                            {/* Note Field */}
                            <input
                                type="text"
                                value={donatorNote}
                                onChange={(e) => setDonatorNote(e.target.value)}
                                placeholder="Optional note (e.g., donation amount, date)"
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={donatorAdding || !donatorCallsignId}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    cursor: donatorAdding ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {donatorAdding ? <FaSpinner className="spin" /> : '❤️'}
                                {donatorAdding ? 'Adding...' : 'Add Donator Badge'}
                            </button>
                        </form>
                    </div>

                    {/* Donator List */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '16px' }}>
                            Current Donators ({donators.length})
                        </h3>

                        {donatorsLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <FaSpinner className="spin" /> Loading donators...
                            </div>
                        ) : donators.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No donators added yet. Add a donator above to assign the badge.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {donators.map((donator) => (
                                    <div
                                        key={donator.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '16px',
                                            background: 'rgba(255, 215, 0, 0.05)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255, 215, 0, 0.2)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ color: '#ffd700', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                ❤️ {donator.callsigns?.callsign || 'Unknown Callsign'}
                                            </div>
                                            {donator.callsigns?.name && (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                                                    {donator.callsigns.name}
                                                </div>
                                            )}
                                            {donator.callsigns?.email && (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                                                    {donator.callsigns.email}
                                                </div>
                                            )}
                                            {donator.donator_note && (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                                    Note: {donator.donator_note}
                                                </div>
                                            )}
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                                Added {new Date(donator.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDonator(donator.callsign_id)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                                color: '#ef4444',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <FaTrash /> Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageAdmins;
