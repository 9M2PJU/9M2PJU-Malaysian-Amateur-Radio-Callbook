import React, { useState } from 'react';
import { FaBroadcastTower } from 'react-icons/fa';
import SubmissionModal from './SubmissionModal';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <nav className="glass-panel" style={{
                margin: '20px',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '20px',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaBroadcastTower size={28} color="var(--primary)" />
                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        MY-Callbook
                    </h1>
                </div>
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                        style={{ fontSize: '1rem' }}
                    >
                        + Register / Update
                    </button>
                </div>
            </nav>
            <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
