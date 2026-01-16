import React, { useState, useEffect } from 'react';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower, FaSpinner, FaEye, FaCircle } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const StatsDashboard = ({ totalCount }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineCount, setOnlineCount] = useState(0);
    const [totalVisitors, setTotalVisitors] = useState(0);

    // Fetch directory stats
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

    // Track online presence
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [user?.id]);

    // Track visitor count (once per session)
    useEffect(() => {
        const sessionKey = 'my-callbook-visited';
        const hasVisited = sessionStorage.getItem(sessionKey);

        const trackVisit = async () => {
            try {
                if (!hasVisited) {
                    const { data } = await supabase.rpc('increment_visit');
                    setTotalVisitors(data || 0);
                    sessionStorage.setItem(sessionKey, 'true');
                } else {
                    const { data } = await supabase.rpc('get_visit_count');
                    setTotalVisitors(data || 0);
                }
            } catch (err) {
                console.error('Error tracking visit:', err);
            }
        };

        trackVisit();
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

                {/* License Classes */}
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

                {/* Top States */}
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

                {/* Recently Added */}
                <div style={statCardStyle}>
                    <FaClock style={{ fontSize: '1.5rem', color: '#22c55e', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{stats.recent_count}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Added (30 days)</div>
                </div>

                {/* Online Users */}
                <div style={statCardStyle}>
                    <FaCircle style={{ fontSize: '1.5rem', color: '#22c55e', marginBottom: '8px', animation: 'pulse 2s infinite' }} />
                    <div style={{ ...statNumberStyle, color: '#22c55e', background: 'none' }}>{onlineCount}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Online Now</div>
                </div>

                {/* Total Visitors */}
                <div style={statCardStyle}>
                    <FaEye style={{ fontSize: '1.5rem', color: '#a855f7', marginBottom: '8px' }} />
                    <div style={{ ...statNumberStyle, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}>{totalVisitors}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Visits</div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default StatsDashboard;
