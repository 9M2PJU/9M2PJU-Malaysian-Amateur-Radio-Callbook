import React from 'react';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower } from 'react-icons/fa';

const StatsDashboard = ({ data, totalCount }) => {
    // Calculate statistics
    const totalOperators = totalCount || data.length;

    // Count by state
    const stateCount = data.reduce((acc, item) => {
        const state = item.location.toUpperCase();
        acc[state] = (acc[state] || 0) + 1;
        return acc;
    }, {});

    // Get top 3 states
    const topStates = Object.entries(stateCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // Count by license class
    const classCount = {
        'Class A': data.filter(d => d.callsign.startsWith('9M')).length,
        'Class B': data.filter(d => d.callsign.startsWith('9W2') || d.callsign.startsWith('9W6') || d.callsign.startsWith('9W8')).length,
        'Class C': data.filter(d => d.callsign.startsWith('9W3')).length
    };

    // Count recently added (entries with addedDate within last 7 days)
    const recentCount = data.filter(d => {
        if (!d.addedDate) return false;
        const added = new Date(d.addedDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return added >= sevenDaysAgo;
    }).length;

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

    return (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
            <h2 style={{
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-main)'
            }}>
                <FaBroadcastTower color="var(--primary)" /> Directory Statistics
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
            }}>
                {/* Total Operators */}
                <div style={statCardStyle}>
                    <FaUsers style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{totalOperators}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Operators</div>
                </div>

                {/* License Classes */}
                <div style={statCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>By Class</div>
                    {Object.entries(classCount).filter(([_, count]) => count > 0).map(([cls, count]) => (
                        <div key={cls} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.85rem',
                            padding: '4px 0',
                            borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{cls.split(' ')[0]} {cls.split(' ')[1]}</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Top States */}
                <div style={statCardStyle}>
                    <FaMapMarkerAlt style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Top Locations</div>
                    {topStates.map(([state, count], idx) => (
                        <div key={state} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.85rem',
                            padding: '4px 0'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{idx + 1}. {state}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Recently Added */}
                <div style={statCardStyle}>
                    <FaClock style={{ fontSize: '1.5rem', color: '#22c55e', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{recentCount}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Added (7 days)</div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
