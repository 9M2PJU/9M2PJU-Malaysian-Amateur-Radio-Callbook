import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--glass-border)',
            marginTop: '40px'
        }}>
            {/* Disclaimer */}
            <div style={{
                maxWidth: '600px',
                margin: '0 auto 20px',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                lineHeight: '1.5'
            }}>
                <strong>⚠️ Disclaimer:</strong> All information displayed on this website is provided by users
                and is not guaranteed to be accurate, complete, or up-to-date. The maintainer does not verify
                the authenticity of submissions. Use this information at your own discretion.
            </div>

            <p style={{ margin: 0 }}>
                &copy; {new Date().getFullYear()} Malaysian Amateur Radio Callbook
                <br />
                <span style={{ fontSize: '0.9em' }}>Made for 🇲🇾 by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>9M2PJU</a></span>
            </p>
        </footer>
    );
};

export default Footer;
