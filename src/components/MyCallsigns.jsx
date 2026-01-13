import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import Card from './Card';
import Navbar from './Navbar';
import Footer from './Footer';
import SubmissionModal from './SubmissionModal';
import { FaPlus, FaEdit } from 'react-icons/fa';

const MyCallsigns = () => {
    const { user } = useAuth();
    const [callsigns, setCallsigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (user) {
            fetchMyCallsigns();
        }
    }, [user]);

    const fetchMyCallsigns = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('callsigns')
                .select('*')
                .eq('user_id', user.id)
                .order('callsign', { ascending: true });

            if (error) throw error;

            const transformedData = data.map(item => ({
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
                addedDate: item.added_date
            }));

            setCallsigns(transformedData);
        } catch (error) {
            console.error('Error fetching my callsigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data) => {
        setEditData(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null);
        fetchMyCallsigns(); // Refresh data after close (potential edit/add)
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container" style={{ minHeight: '80vh', padding: '20px' }}>
                <div style={{
                    marginTop: '40px',
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            color: '#fff',
                            marginBottom: '10px',
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            My Callsigns
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Mange the callsigns you have submitted.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                        Loading...
                    </div>
                ) : callsigns.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
                        <h3 style={{ color: '#fff', marginBottom: '10px' }}>No callsigns found</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                            You haven't submitted any callsigns yet.
                        </p>
                        <button
                            onClick={() => { setEditData(null); setIsModalOpen(true); }}
                            className="btn-primary"
                        >
                            + Add Your First Callsign
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        {callsigns.map((item) => (
                            <div key={item.callsign} style={{ position: 'relative' }}>
                                <Card data={item} />
                                <button
                                    onClick={() => handleEdit(item)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                        zIndex: 10
                                    }}
                                >
                                    <FaEdit /> Edit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editData}
            />

            <Footer />
        </div>
    );
};

export default MyCallsigns;
