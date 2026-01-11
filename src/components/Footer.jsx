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
                &copy; {new Date().getFullYear()} 9M2PJU Malaysian Amateur Radio Call Book.
                <br />
                <span style={{ fontSize: '0.8em' }}>Open Source Project - Hosted on GitHub Pages</span>
            </p>
        </footer>
    );
};

export default Footer;
