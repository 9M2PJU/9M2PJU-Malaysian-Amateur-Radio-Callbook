import React, { useState, useEffect } from 'react';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower, FaSpinner } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const StatsDashboard = ({ totalCount }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase.rpc('get_public_stats');
                if (error) throw error;
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCardStyle = {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid var(--glass-border)'
    };

    const statNumberStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
    };

    if (loading) {
        return (
            <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 24px)', marginBottom: '30px', textAlign: 'center' }}>
                <FaSpinner className="spin" /> Loading statistics...
            </div>
        );
    }

    if (!stats) return null;

    // Use totalCount from props if available (more accurate with filters), otherwise use stats
    const totalOperators = totalCount || stats.total_operators;

    return (
        <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 24px)', marginBottom: '30px' }}>
            <h2 style={{
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-main)',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)'
            }}>
                <FaBroadcastTower color="var(--primary)" /> Directory Statistics
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                gap: 'clamp(10px, 3vw, 16px)'
            }}>
                {/* Total Operators */}
                <div style={statCardStyle}>
                    <FaUsers style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{totalOperators}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Operators</div>
                </div>

                {/* License Classes - from database */}
                <div style={statCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>By Class</div>
                    {Object.entries(stats.class_counts || {}).filter(([_, count]) => count > 0).map(([cls, count]) => (
                        <div key={cls} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                            padding: '4px 0',
                            borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{cls}</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Top States - from database */}
                <div style={statCardStyle}>
                    <FaMapMarkerAlt style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Top Locations</div>
                    {(stats.top_locations || []).map((loc, idx) => (
                        <div key={loc.location} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                            padding: '4px 0'
                        }}>
                            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                                {idx + 1}. {loc.location}
                            </span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{loc.count}</span>
                        </div>
                    ))}
                </div>

                {/* Recently Added - from database */}
                <div style={statCardStyle}>
                    <FaClock style={{ fontSize: '1.5rem', color: '#22c55e', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{stats.recent_count}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Added (30 days)</div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
