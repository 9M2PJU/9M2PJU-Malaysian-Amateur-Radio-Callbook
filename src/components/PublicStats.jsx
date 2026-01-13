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

    const statCardStyle = {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '15px',
        textAlign: 'center',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const statNumberStyle = {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        margin: '5px 0'
    };

    const statLabelStyle = {
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: '30px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '15px'
            }}>
                {/* Total Operators */}
                <div style={statCardStyle}>
                    <FaUsers style={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                    <div style={statNumberStyle}>{stats.total_operators}</div>
                    <div style={statLabelStyle}>Total Operators</div>
                </div>

                {/* License breakdown (compact) */}
                <div style={statCardStyle}>
                    <FaBroadcastTower style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '5px' }} />
                    <div style={{ width: '100%' }}>
                        {Object.entries(stats.class_counts).map(([cls, count]) => (
                            <div key={cls} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                padding: '2px 0'
                            }}>
                                <span style={{ color: 'var(--text-muted)' }}>{cls}</span>
                                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Locations */}
                <div style={statCardStyle}>
                    <FaMapMarkerAlt style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '5px' }} />
                    <div style={{ width: '100%' }}>
                        {stats.top_locations?.map((loc, idx) => (
                            <div key={loc.location} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                padding: '2px 0'
                            }}>
                                <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%', textAlign: 'left' }}>
                                    {loc.location}
                                </span>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{loc.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Added */}
                <div style={statCardStyle}>
                    <FaClock style={{ fontSize: '1.2rem', color: '#22c55e' }} />
                    <div style={statNumberStyle}>{stats.recent_count}</div>
                    <div style={statLabelStyle}>New (7 Days)</div>
                </div>
            </div>
        </div>
    );
};

export default PublicStats;
