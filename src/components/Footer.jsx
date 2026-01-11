import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--glass-border)',
            marginTop: '40px'
        }}>
            <p>
                &copy; {new Date().getFullYear()} Malaysian Amateur Radio Call Book
                <br />
                <span style={{ fontSize: '0.9em' }}>Made for 🇲🇾 by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>9M2PJU</a></span>
            </p>
        </footer>
    );
};

export default Footer;
