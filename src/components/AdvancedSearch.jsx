import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { MALAYSIAN_DISTRICTS } from '../constants';

const AdvancedSearch = ({ onSearch, onFilterChange, filters, states, searchTerm = '' }) => {
    // Local state to track input value (for immediate feedback)
    const [inputValue, setInputValue] = React.useState(searchTerm);
    const searchInputRef = React.useRef(null);

    // Sync local state when searchTerm prop changes (e.g., from URL params on load or reset)
    React.useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    const handleClear = () => {
        setInputValue('');
        onSearch('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onSearch(value);
    };

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

    const optionStyle = {
        backgroundColor: '#1a1a2e',
        color: '#ffffff'
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <FaFilter color="var(--primary)" />
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Search & Filter</h3>
            </div>

            {/* Search Input - Full Width on Top */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
                <FaSearch style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem'
                }} />
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by callsign, name, or location..."
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{
                        ...inputStyle,
                        paddingLeft: '48px',
                        paddingRight: '48px',
                        padding: '14px 48px',
                        fontSize: '1.05rem',
                        borderRadius: '10px'
                    }}
                />
                {inputValue && (
                    <button
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '50%',
                            transition: 'all 0.2s ease'
                        }}
                        title="Clear Search"
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Filter Label */}
            <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
            }}>
                Filter by
            </div>

            {/* Filters Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
            }}>
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

                {/* District Filter (Dependent on State) */}
                <select
                    value={filters.district || ''}
                    onChange={(e) => onFilterChange('district', e.target.value)}
                    style={{ ...selectStyle, cursor: filters.state ? 'pointer' : 'not-allowed', opacity: filters.state ? 1 : 0.6 }}
                    disabled={!filters.state}
                >
                    <option value="">All Districts</option>
                    {filters.state && MALAYSIAN_DISTRICTS[filters.state]?.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                    ))}
                </select>

                {/* License Class Filter */}
                <select
                    value={filters.licenseClass}
                    onChange={(e) => onFilterChange('licenseClass', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Classes</option>
                    <option value="A">Class A</option>
                    <option value="B">Class B</option>
                    <option value="C">Class C</option>
                </select>

                {/* License Status Filter */}
                <select
                    value={filters.licenseStatus || ''}
                    onChange={(e) => onFilterChange('licenseStatus', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Status</option>
                    <option value="active">✅ Active</option>
                    <option value="expiring">⚠️ Expiring Soon</option>
                    <option value="expired">❌ Expired</option>
                </select>

                {/* Submission Date Filter */}
                <select
                    value={filters.recentOnly}
                    onChange={(e) => onFilterChange('recentOnly', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Entries</option>
                    <option value="7">Last week</option>
                    <option value="30">Last month</option>
                    <option value="180">Last 6 months</option>
                    <option value="365">Last 1 year</option>
                    <option value="older">Older than 1 year</option>
                </select>

                {/* Contact Availability Filter */}
                <select
                    value={filters.contactInfo || ''}
                    onChange={(e) => onFilterChange('contactInfo', e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Contacts</option>
                    <option value="hasPhone">📱 Has Phone</option>
                    <option value="hasEmail">📧 Has Email</option>
                    <option value="hasBoth">✅ Has Both</option>
                    <option value="noContact">❌ No Contact</option>
                </select>
            </div>
        </div>
    );
};

export default AdvancedSearch;
