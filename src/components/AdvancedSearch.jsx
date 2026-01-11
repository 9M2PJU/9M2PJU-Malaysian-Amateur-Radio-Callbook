import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const AdvancedSearch = ({ onSearch, onFilterChange, filters, states }) => {
    const inputStyle = {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--text-main)',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center'
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <FaFilter color="var(--primary)" />
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Search & Filter</h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search callsign, name, location..."
                        onChange={(e) => onSearch(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '40px' }}
                    />
                </div>

                {/* State Filter */}
                <select
                    value={filters.state}
                    onChange={(e) => onFilterChange('state', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All States</option>
                    {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>

                {/* License Class Filter */}
                <select
                    value={filters.licenseClass}
                    onChange={(e) => onFilterChange('licenseClass', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Classes</option>
                    <option value="9M">Class A (9M)</option>
                    <option value="9W2">Class B (9W2)</option>
                    <option value="9W6">Class B (9W6)</option>
                    <option value="9W8">Class B (9W8)</option>
                    <option value="9W3">Class C (9W3)</option>
                </select>

                {/* Recently Added Filter */}
                <select
                    value={filters.recentOnly}
                    onChange={(e) => onFilterChange('recentOnly', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Entries</option>
                    <option value="7">Added last 7 days</option>
                    <option value="30">Added last 30 days</option>
                    <option value="90">Added last 90 days</option>
                </select>
            </div>
        </div>
    );
};

export default AdvancedSearch;
