import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaUsers, FaClock, FaSpinner, FaCircle, FaEye } from 'react-icons/fa';

const PublicStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                console.error('Error fetching public stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Track online presence (anonymous channel for login page)
    useEffect(() => {
        const visitorId = sessionStorage.getItem('visitor-id') || `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('visitor-id', visitorId);

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: visitorId,
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
                        visitor_id: visitorId,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, []);

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
                // Functions may not exist yet, just log
                console.error('Error tracking visit:', err);
            }
        };

        trackVisit();
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
        padding: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        fontSize: '0.7rem',
        whiteSpace: 'nowrap'
    };

    const countStyle = {
        fontWeight: 'bold',
        color: 'var(--primary)'
    };

    return (
        <div className="badge-container" style={{
            width: '100%',
            maxWidth: '550px',
            margin: '0 auto 10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            padding: '5px 10px',
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

            {/* Online Now Badge */}
            <div style={{ ...badgeStyle, borderColor: '#22c55e' }}>
                <FaCircle size={8} color="#22c55e" style={{ animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{onlineCount} Online</span>
            </div>

            {/* Total Visitors Badge */}
            {totalVisitors > 0 && (
                <div style={{ ...badgeStyle, borderColor: '#a855f7' }}>
                    <FaEye size={12} color="#a855f7" />
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{totalVisitors} Visits</span>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default PublicStats;
