import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import AdvancedSearch from './components/AdvancedSearch';
import StatsDashboard from './components/StatsDashboard';
import Card from './components/Card';
import Footer from './components/Footer';

function App() {
    const [callsigns, setCallsigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        state: '',
        licenseClass: '',
        recentOnly: ''
    });
    const [states, setStates] = useState([]);

    useEffect(() => {
        fetchCallsigns();
    }, []);

    const fetchCallsigns = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('callsigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match existing format (snake_case to camelCase)
            const transformedData = data.map(item => ({
                callsign: item.callsign,
                name: item.name,
                location: item.location,
                email: item.email || '',
                phone: item.phone || '',
                address: item.address || '',
                website: item.website || '',
                facebook: item.facebook || '',
                qrz: item.qrz || '',
                dmrId: item.dmr_id || '',
                martsId: item.marts_id || '',
                addedDate: item.added_date
            }));

            setCallsigns(transformedData);
            setFiltered(transformedData);

            // Extract unique states
            const uniqueStates = [...new Set(transformedData.map(d => d.location.toUpperCase()))].sort();
            setStates(uniqueStates);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Apply all filters
    const applyFilters = (term, currentFilters) => {
        let results = [...callsigns];

        // Text search
        if (term) {
            const upperTerm = term.toUpperCase();
            results = results.filter(item =>
                item.callsign.toUpperCase().includes(upperTerm) ||
                item.name.toUpperCase().includes(upperTerm) ||
                item.location.toUpperCase().includes(upperTerm)
            );
        }

        // State filter
        if (currentFilters.state) {
            results = results.filter(item =>
                item.location.toUpperCase() === currentFilters.state.toUpperCase()
            );
        }

        // License class filter
        if (currentFilters.licenseClass) {
            if (currentFilters.licenseClass === 'A') {
                results = results.filter(item => item.callsign.startsWith('9M'));
            } else if (currentFilters.licenseClass === 'B') {
                results = results.filter(item =>
                    item.callsign.startsWith('9W2') ||
                    item.callsign.startsWith('9W6') ||
                    item.callsign.startsWith('9W8')
                );
            } else if (currentFilters.licenseClass === 'C') {
                results = results.filter(item => item.callsign.startsWith('9W3'));
            }
        }

        // Recently added filter
        if (currentFilters.recentOnly) {
            const days = parseInt(currentFilters.recentOnly);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            results = results.filter(item => {
                if (!item.addedDate) return false;
                return new Date(item.addedDate) >= cutoffDate;
            });
        }

        setFiltered(results);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        applyFilters(term, filters);
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters);
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container" style={{ minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', margin: '40px 0 40px' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.1
                    }}>
                        Malaysian Amateur<br />Radio Directory
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        The Modern Interactive Callbook
                    </p>
                </div>

                {/* Statistics Dashboard */}
                {!loading && !error && callsigns.length > 0 && (
                    <StatsDashboard data={callsigns} />
                )}

                {/* Advanced Search */}
                <AdvancedSearch
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    filters={filters}
                    states={states}
                />

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Loading Directory...</div>
                        <div>Fetching data from database</div>
                    </div>
                )}

                {error && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid red',
                        borderRadius: '8px',
                        color: '#ff6666',
                        maxWidth: '600px',
                        margin: '0 auto 20px'
                    }}>
                        <h3>Error Loading Data</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} style={{
                            background: '#ff4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Results count */}
                {!loading && !error && (
                    <div style={{
                        marginBottom: '20px',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>Showing {filtered.length} of {callsigns.length} operators</span>
                        {(searchTerm || filters.state || filters.licenseClass || filters.recentOnly) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({ state: '', licenseClass: '', recentOnly: '' });
                                    setFiltered(callsigns);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-muted)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        {filtered.map((item, index) => (
                            <Card key={index} data={item} />
                        ))}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', padding: '40px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
                        <h3>No operators found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
