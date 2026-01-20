import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { getLicenseStatus } from './utils/licenseStatus';
import { useToast } from './components/Toast';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

// Lazy load components for better code splitting
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const UpdatePassword = lazy(() => import('./components/UpdatePassword'));
const MyCallsigns = lazy(() => import('./components/MyCallsigns'));
const ManageAdmins = lazy(() => import('./components/ManageAdmins'));

// Keep frequently used components loaded
import Navbar from './components/Navbar';
import AdvancedSearch from './components/AdvancedSearch';
import StatsDashboard from './components/StatsDashboard';
import Card from './components/Card';
import Footer from './components/Footer';
import SubmissionModal from './components/SubmissionModal';
import BackToTop from './components/BackToTop';

import { MALAYSIAN_STATES } from './constants';

// Loading spinner for lazy components
const LazyLoadSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        color: 'var(--text-muted)'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📡</div>
            <div>Loading...</div>
        </div>
    </div>
);

function Directory() {
    const toast = useToast();
    const location = useLocation();
    const listRef = useRef(null);

    // Helper to get saved filters from localStorage
    const getSavedFilters = () => {
        try {
            const saved = localStorage.getItem('callbook_filters');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error reading saved filters:', e);
        }
        return null;
    };

    const savedFilters = getSavedFilters();

    // Initialize state
    const [callsigns, setCallsigns] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState(savedFilters?.searchTerm || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        state: savedFilters?.state || '',
        district: savedFilters?.district || '',
        licenseClass: savedFilters?.licenseClass || '',
        licenseStatus: savedFilters?.licenseStatus || '',
        recentOnly: savedFilters?.recentOnly || '',
        contactInfo: savedFilters?.contactInfo || ''
    });
    const [states, setStates] = useState(MALAYSIAN_STATES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Virtualization State
    const [columnCount, setColumnCount] = useState(1);

    // Calculate columns based on width
    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            // Matches CSS grid logic: minmax(320px, 1fr) with adjustments for container padding
            // Container max-width is 1200px.
            // < 768px: padding 12px
            // < 480px: padding 8px
            let containerWidth = width;
            if (width > 1200) containerWidth = 1200;

            // Adjust for container padding
            const padding = width <= 480 ? 16 : (width <= 768 ? 24 : 40);
            const availableWidth = containerWidth - padding;

            // Reduced min-width to 280px for better mobile support as planned
            const minCardWidth = 300;
            const gap = 24;

            const cols = Math.floor((availableWidth + gap) / (minCardWidth + gap));
            setColumnCount(Math.max(1, cols));
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const ITEMS_PER_PAGE = 50;

    // Helper to save filters to localStorage
    const saveFilters = (term, currentFilters) => {
        try {
            const data = {
                searchTerm: term,
                ...currentFilters
            };
            localStorage.setItem('callbook_filters', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving filters:', e);
        }
    };

    // Helper to clear saved filters
    const clearSavedFilters = () => {
        try {
            localStorage.removeItem('callbook_filters');
        } catch (e) {
            console.error('Error clearing filters:', e);
        }
    };

    useEffect(() => {
        console.log('App Initializing...');
        fetchCallsigns(0, searchTerm, filters, true);
    }, []);

    useEffect(() => {
        const handleResetFilters = () => {
            const emptyFilters = {
                state: '',
                district: '',
                licenseClass: '',
                licenseStatus: '',
                recentOnly: '',
                contactInfo: ''
            };
            setSearchTerm('');
            setFilters(emptyFilters);
            setCallsigns([]);
            setPage(0);
            clearSavedFilters();
            fetchCallsigns(0, '', emptyFilters, true);
        };

        window.addEventListener('resetFilters', handleResetFilters);
        return () => window.removeEventListener('resetFilters', handleResetFilters);
    }, []);


    const fetchCallsigns = async (pageToFetch, term, currentFilters, reset = false) => {
        try {
            setLoading(true);

            // Fetch donator callsign IDs separately
            const { data: donatorData } = await supabase
                .from('user_profiles')
                .select('callsign_id')
                .eq('is_donator', true);

            const donatorCallsignIds = new Set(
                (donatorData || []).map(d => d.callsign_id).filter(Boolean)
            );

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

            if (currentFilters.district) {
                query = query.eq('district', currentFilters.district);
            }

            if (currentFilters.licenseClass) {
                if (currentFilters.licenseClass === 'A') query = query.ilike('callsign', '9M%');
                if (currentFilters.licenseClass === 'B') query = query.or('callsign.ilike.9W2%,callsign.ilike.9W6%,callsign.ilike.9W8%');
                if (currentFilters.licenseClass === 'C') query = query.ilike('callsign', '9W3%');
            }

            if (currentFilters.recentOnly) {
                if (currentFilters.recentOnly === 'older') {
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 365);
                    query = query.lt('added_date', cutoffDate.toISOString().split('T')[0]);
                } else {
                    const days = parseInt(currentFilters.recentOnly);
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - days);
                    query = query.gte('added_date', cutoffDate.toISOString().split('T')[0]);
                }
            }

            const from = pageToFetch * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error, count } = await query
                .order('added_date', { ascending: false })
                .order('created_at', { ascending: false })
                .order('callsign', { ascending: true })
                .range(from, to);

            if (error) throw error;

            let transformedData = data.map(item => ({
                id: item.id,
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
                meshtasticId: item.meshtastic_id || '',
                district: item.district || '',
                gridLocator: item.grid_locator || '',
                aprsCallsign: item.aprs_callsign || '',
                addedDate: item.added_date,
                expiryDate: item.expiry_date || '',
                telegramChatId: item.telegram_chat_id || '',
                telegramUsername: item.telegram_username || '',
                isPpmMember: item.is_ppm_member || false,
                isBsmmMember: item.is_bsmm_member || false,
                isPppmMember: item.is_pppm_member || false,
                isVeteran: item.is_veteran || false,
                isDonator: donatorCallsignIds.has(item.id),
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));

            if (currentFilters.licenseStatus) {
                transformedData = transformedData.filter(item => {
                    const status = getLicenseStatus(item.expiryDate);
                    if (!status && currentFilters.licenseStatus !== '') {
                        return false;
                    }
                    return status && status.status === currentFilters.licenseStatus;
                });
            }

            if (currentFilters.contactInfo) {
                transformedData = transformedData.filter(item => {
                    const hasPhone = item.phone && item.phone.trim() !== '';
                    const hasEmail = item.email && item.email.trim() !== '';

                    switch (currentFilters.contactInfo) {
                        case 'hasPhone': return hasPhone;
                        case 'hasEmail': return hasEmail;
                        case 'hasBoth': return hasPhone && hasEmail;
                        case 'noContact': return !hasPhone && !hasEmail;
                        default: return true;
                    }
                });
            }

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

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        // Clear current data to show loading spinner for search
        setCallsigns([]);
        setPage(0);
        // Save to localStorage
        saveFilters(term, filters);
        // Reset to page 0 for new search
        fetchCallsigns(0, term, filters, true);
    }, [filters]);

    useEffect(() => {
        const handleTriggerSearch = (e) => {
            if (e.detail) {
                handleSearch(e.detail);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        window.addEventListener('triggerSearch', handleTriggerSearch);
        return () => window.removeEventListener('triggerSearch', handleTriggerSearch);
    });

    useEffect(() => {
        if (location.state?.search) {
            handleSearch(location.state.search);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    const handleFilterChange = useCallback((filterName, value) => {
        let newFilters = { ...filters, [filterName]: value };

        // Reset district if state filter changes
        if (filterName === 'state') {
            newFilters.district = '';
        }

        setFilters(newFilters);
        // Clear current data to show loading spinner
        setCallsigns([]);
        setPage(0);
        // Save to localStorage
        saveFilters(searchTerm, newFilters);
        // Reset to page 0 for new filter
        fetchCallsigns(0, searchTerm, newFilters, true);
    }, [filters, searchTerm]);

    const loadMore = useCallback(() => {
        if (loading) return;
        setLoading(true);
        // Add artificial delay to show loading animation
        setTimeout(() => {
            fetchCallsigns(page + 1, searchTerm, filters, false);
        }, 1000);
    }, [page, searchTerm, filters, loading]);

    const handleEdit = useCallback((data) => {
        setEditData(data);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(async (data) => {
        if (!window.confirm(`Are you sure you want to delete ${data.callsign}? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('callsigns')
                .delete()
                .eq('id', data.id);

            if (error) throw error;

            toast.success(`Callsign ${data.callsign} deleted successfully`);
            // Refresh the list
            fetchCallsigns(0, searchTerm, filters, true);
        } catch (err) {
            console.error('Error deleting callsign:', err);
            toast.error('Failed to delete callsign: ' + err.message);
        }
    }, [searchTerm, filters]);

    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        setEditData(null);
        if (shouldRefresh) {
            fetchCallsigns(0, searchTerm, filters, true);
        }
    };

    const handleClearAll = () => {
        const emptyFilters = { state: '', district: '', licenseClass: '', licenseStatus: '', recentOnly: '', contactInfo: '' };
        setSearchTerm('');
        setFilters(emptyFilters);
        setCallsigns([]);
        setPage(0);
        clearSavedFilters();
        fetchCallsigns(0, '', emptyFilters, true);
    };

    const hasActiveFilters = !!(searchTerm || filters.state || filters.district || filters.licenseClass || filters.licenseStatus || filters.recentOnly || filters.contactInfo);

    // Virtualization Logic
    const rowCount = Math.ceil(callsigns.length / columnCount);

    // Virtualizer instance
    const virtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => 400, // Approximate height of a card including gap
        overscan: 5,
        scrollMargin: listRef.current?.offsetTop ?? 0,
    });

    const items = virtualizer.getVirtualItems();

    // Infinite Scroll Logic
    useEffect(() => {
        if (!items.length) return;
        const lastItem = items[items.length - 1];
        if (lastItem.index >= rowCount - 1 && hasMore && !loading) {
            loadMore();
        }
    }, [items, rowCount, hasMore, loading, loadMore]);

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container" ref={listRef} style={{ minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', margin: '40px 0 0' }}>
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
                        "The Modern Yellow Pages for Malaysian Amateur Radio Operators" - <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>9M2PJU</a>
                    </p>
                </div>

                {!loading && !error && callsigns.length > 0 && (
                    <StatsDashboard totalCount={totalCount} style={{ marginBottom: '-4px' }} />
                )}

                <AdvancedSearch
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    filters={filters}
                    states={states}
                    searchTerm={searchTerm}
                    onClear={handleClearAll}
                    hasActiveFilters={hasActiveFilters}
                    style={{ marginTop: '-4px', marginBottom: '-8px' }}
                />

                {loading && callsigns.length === 0 && (
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



                {/* Virtualized List */}
                {callsigns.length > 0 && !error && (
                    <>
                        <div style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                            marginTop: '-12px',
                        }}>
                            {items.map((virtualRow) => {
                                const rowStartIndex = virtualRow.index * columnCount;
                                const rowItems = callsigns.slice(rowStartIndex, rowStartIndex + columnCount);

                                return (
                                    <div
                                        key={virtualRow.key}
                                        data-index={virtualRow.index}
                                        ref={virtualizer.measureElement}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start}px)`,
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                                            gap: '24px',
                                            paddingBottom: '24px' // Add gap to bottom of row
                                        }}
                                    >
                                        {rowItems.map((item) => (
                                            <Card
                                                key={item.id}
                                                data={item}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '40px',
                                marginBottom: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px'
                            }}
                        >
                            {loading && (
                                <div style={{
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}>
                                    <div className="loading-spinner" style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid var(--glass-border)',
                                        borderTop: '2px solid var(--primary)',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    Loading more...
                                </div>
                            )}

                            {!loading && hasMore && (
                                <div style={{ height: '20px' }} /> /* Spacer for auto-load trigger area */
                            )}

                            {!hasMore && callsigns.length > 0 && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    ✓ All {totalCount} operators loaded
                                </div>
                            )}
                        </div>
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

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editData}
            />

            <BackToTop />
            <Footer />
        </div >
    );
}

import PWAInstallPrompt from './components/PWAInstallPrompt';
import LiveNotifications from './components/LiveNotifications';
import { PWAProvider } from './components/PWAContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <PWAProvider>
                    <Suspense fallback={<LazyLoadSpinner />}>
                        <AutoLogoutToastHandler />
                        <PWAInstallPrompt />
                        <LiveNotifications />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/update-password" element={<UpdatePassword />} />
                            <Route
                                path="/my-callsigns"
                                element={
                                    <ProtectedRoute>
                                        <MyCallsigns />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manage-admins"
                                element={
                                    <ProtectedRoute>
                                        <ManageAdmins />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Directory />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Suspense>
                </PWAProvider>
            </AuthProvider>
        </Router>
    );
}

// Helper component to handle Toast logic inside Router context
const AutoLogoutToastHandler = () => {
    const toast = useToast();
    const navigate = React.useCallback((path) => {
        window.location.href = path; // Force hard redirect to ensure clean state
    }, []);

    useEffect(() => {
        const handleAutoLogout = () => {
            toast.error('You have been logged out due to inactivity (5 mins).');
        };

        window.addEventListener('autoLogout', handleAutoLogout);
        return () => window.removeEventListener('autoLogout', handleAutoLogout);
    }, [toast]);

    return null;
};

export default App;
