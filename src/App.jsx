import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Search from './components/Search';
import Card from './components/Card';
import Footer from './components/Footer';

function App() {
    const [callsigns, setCallsigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch the latest callsign data directly from the repository (no rebuild needed)
        fetch('https://raw.githubusercontent.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book/main/public/callsigns.json')
            .then(res => res.json())
            .then(data => {
                setCallsigns(data);
                setFiltered(data);
            })
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        const upperTerm = term.toUpperCase();
        const results = callsigns.filter(item =>
            item.callsign.toUpperCase().includes(upperTerm) ||
            item.name.toUpperCase().includes(upperTerm) ||
            item.location.toUpperCase().includes(upperTerm)
        );
        setFiltered(results);
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container" style={{ minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
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

                <Search onSearch={handleSearch} />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {filtered.map((item, index) => (
                        <Card key={index} data={item} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        No callsigns found for "{searchTerm}"
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
