import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower, FaSpinner } from 'react-icons/fa';

const PublicStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase.rpc('get_public_stats');
                if (error) throw error;
                setStats(data);
            } catch (err) {
                console.error('Error fetching public stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                <FaSpinner className="spin" /> Loading stats...
            </div>
        );
    }

    if (error || !stats) return null;

    const badgeStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8rem',
        whiteSpace: 'nowrap'
    };

    const countStyle = {
        fontWeight: 'bold',
        color: 'var(--primary)'
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px'
        }}>
            {/* Total Badge */}
            <div style={badgeStyle}>
                <FaUsers size={12} color="var(--primary)" />
                <span style={{ color: 'var(--text-muted)' }}>Total:</span>
                <span style={countStyle}>{stats.total_operators}</span>
            </div>

            {/* Class A Badge */}
            <div style={badgeStyle}>
                <span style={{ color: 'var(--text-muted)' }}>Class A:</span>
                <span style={{ ...countStyle, color: 'var(--secondary)' }}>{stats.class_counts['Class A']}</span>
            </div>

            {/* Class B Badge */}
            <div style={badgeStyle}>
                <span style={{ color: 'var(--text-muted)' }}>Class B:</span>
                <span style={{ ...countStyle, color: 'var(--secondary)' }}>{stats.class_counts['Class B']}</span>
            </div>

            {/* Class C Badge */}
            <div style={badgeStyle}>
                <span style={{ color: 'var(--text-muted)' }}>Class C:</span>
                <span style={{ ...countStyle, color: 'var(--secondary)' }}>{stats.class_counts['Class C']}</span>
            </div>

            {/* Recent Badge */}
            {stats.recent_count > 0 && (
                <div style={{ ...badgeStyle, borderColor: '#22c55e' }}>
                    <FaClock size={12} color="#22c55e" />
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{stats.recent_count} NEW</span>
                </div>
            )}
        </div>
    );
};

export default PublicStats;
