import React from 'react';
import { FaUsers, FaMapMarkerAlt, FaClock, FaBroadcastTower } from 'react-icons/fa';

const StatsDashboard = ({ data, totalCount, recentCount }) => {
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

    // recentCount now comes from props (queried from database)

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', // reliable 2-col on small usage
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
                    {Object.entries(classCount).filter(([_, count]) => count > 0).map(([cls, count]) => (
                        <div key={cls} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', // slightly smaller on mobile
                            padding: '4px 0',
                            borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{cls}</span> {/* Don't split, just show full or let wrap properly */}
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
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                            padding: '4px 0'
                        }}>
                            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                                {idx + 1}. {state}
                            </span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Recently Added */}
                <div style={statCardStyle}>
                    <FaClock style={{ fontSize: '1.5rem', color: '#22c55e', marginBottom: '8px' }} />
                    <div style={statNumberStyle}>{recentCount}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Added (30 days)</div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
