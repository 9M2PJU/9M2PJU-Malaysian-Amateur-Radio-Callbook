import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ onSearch }) => {
    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 40px' }}>
            <input
                type="text"
                placeholder="Search callsign (e.g., 9M2PJU) or name..."
                onChange={(e) => onSearch(e.target.value)}
                className="glass-panel"
                style={{
                    width: '100%',
                    padding: '20px 20px 20px 60px',
                    fontSize: '1.2rem',
                    color: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                }}
            />
            <FaSearch
                size={24}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
            />
        </div>
    );
};

export default Search;
