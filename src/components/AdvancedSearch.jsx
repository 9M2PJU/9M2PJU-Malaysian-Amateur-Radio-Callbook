import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { MALAYSIAN_DISTRICTS } from '../constants';

const AdvancedSearch = ({ onSearch, onFilterChange, filters, states }) => {
    // We need to track the input value locally to show/hide the clear button
    // However, the parent controls the state via onSearch. 
    // We can check the input value by accessing the input ref or just trust the parent passes the value back.
    // BUT, the current implementation shows `onSearch` just calls a function, it doesn't pass the value back as a prop to this component.
    // Looking at App.jsx (which I viewed earlier), `searchTerm` IS state there.
    // But `AdvancedSearch` doesn't receive `searchTerm` as a prop in the original code? 
    // Let me check lines 54-58 again. 
    // Line 56: onChange={(e) => onSearch(e.target.value)}
    // The input is UNCONTROLLED because it doesn't have a `value` prop!
    // To implement a clear button that clears the input, I need to make it CONTROLLED or use a ref.
    // Making it controlled is better. I need to accept `searchTerm` as a prop.

    // Wait, let me check App.jsx usage of AdvancedSearch again.
    // I can't check App.jsx right now without a tool call, but typically if I add `value={filters.search}` or similar it works. 
    // In App.jsx, I saw `const [searchTerm, setSearchTerm] = useState('')`.
    // And `<AdvancedSearch onSearch={handleSearch} ... />`
    // It did NOT pass `searchTerm` down.

    // So I have to convert this to a controlled component LOCALLY or ask the user to let me refactor App.jsx too.
    // Refactoring is safer.

    // Actually, I can just use a local ref to clear the input value manually.
    // That's the least intrusive change.

    const [hasText, setHasText] = React.useState(false);
    const searchInputRef = React.useRef(null);

    const handleClear = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
            setHasText(false);
            onSearch('');
            searchInputRef.current.focus();
        }
    };

    const handleParamChange = (value) => {
        setHasText(value.length > 0);
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
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search callsign, name, location..."
                        onChange={(e) => handleParamChange(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '40px' }}
                    />
                    {hasText && (
                        <button
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px'
                            }}
                            title="Clear Search"
                        >
                            <FaTimes />
                        </button>
                    )}
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
