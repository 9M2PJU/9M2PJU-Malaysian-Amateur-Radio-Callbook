import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import AdvancedSearch from './components/AdvancedSearch';
import StatsDashboard from './components/StatsDashboard';
import Card from './components/Card';
import Footer from './components/Footer';

const MALAYSIAN_STATES = [
    'JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI SEMBILAN',
    'PAHANG', 'PERAK', 'PERLIS', 'PULAU PINANG', 'SABAH',
    'SARAWAK', 'SELANGOR', 'TERENGGANU', 'KUALA LUMPUR', 'LABUAN', 'PUTRAJAYA'
];

function App() {
    const [callsigns, setCallsigns] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        state: '',
        licenseClass: '',
        recentOnly: ''
    });
    // States are static list for dropdown, fetching once
    const [states, setStates] = useState(MALAYSIAN_STATES);

    const ITEMS_PER_PAGE = 50;

    useEffect(() => {
        // Initial fetch
        fetchCallsigns(0, searchTerm, filters, true);
    }, []);

    const fetchCallsigns = async (pageToFetch, term, currentFilters, reset = false) => {
        try {
            setLoading(true);
            let query = supabase
                .from('callsigns')
                .select('*', { count: 'exact' });

            // Apply Filters
            if (term) {
                const cleanTerm = term.trim();
                query = query.or(`callsign.ilike.%${cleanTerm}%,name.ilike.%${cleanTerm}%,location.ilike.%${cleanTerm}%`);
            }

            if (currentFilters.state) {
                query = query.eq('location', currentFilters.state);
            }

            if (currentFilters.licenseClass) {
                if (currentFilters.licenseClass === 'A') query = query.ilike('callsign', '9M%');
                if (currentFilters.licenseClass === 'B') query = query.or('callsign.ilike.9W2%,callsign.ilike.9W6%,callsign.ilike.9W8%');
                if (currentFilters.licenseClass === 'C') query = query.ilike('callsign', '9W3%');
            }

            if (currentFilters.recentOnly) {
                const days = parseInt(currentFilters.recentOnly);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - days);
                query = query.gte('added_date', cutoffDate.toISOString().split('T')[0]);
            }

            // Pagination
            const from = pageToFetch * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error, count } = await query
                .order('added_date', { ascending: false })
                .order('created_at', { ascending: false })
                .order('callsign', { ascending: true })
                .range(from, to);

            if (error) throw error;

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

            if (reset) {
                setCallsigns(transformedData);
            } else {
                setCallsigns(prev => [...prev, ...transformedData]);
            }

            setTotalCount(count);
            setHasMore(transformedData.length === ITEMS_PER_PAGE);
            setPage(pageToFetch);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        // Reset to page 0 for new search
        fetchCallsigns(0, term, filters, true);
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        // Reset to page 0 for new filter
        fetchCallsigns(0, searchTerm, newFilters, true);
    };

    const loadMore = () => {
        fetchCallsigns(page + 1, searchTerm, filters, false);
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

                {/* Statistics Dashboard - Note: Only shows stats for loaded data now to prevent scraping */}
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

                {loading && page === 0 && (
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
                        <span>Showing {callsigns.length} of {totalCount} operators</span>
                        {(searchTerm || filters.state || filters.licenseClass || filters.recentOnly) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({ state: '', licenseClass: '', recentOnly: '' });
                                    // Reset handled by useEffect dependence on state changes? No, passed explicit
                                    handleSearch(''); // Reset search
                                    // Filter reset effectively done by setFilters but we need to trigger fetch
                                    fetchCallsigns(0, '', { state: '', licenseClass: '', recentOnly: '' }, true);
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

                {/* Grid */}
                {(!loading || page > 0) && !error && (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {callsigns.map((item, index) => (
                                <Card key={`${item.callsign}-${index}`} data={item} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--primary)',
                                        color: 'var(--primary)',
                                        padding: '12px 32px',
                                        borderRadius: '30px',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {loading ? 'Loading...' : 'Load More Operators'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!loading && !error && callsigns.length === 0 && (
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
