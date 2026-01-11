import React from 'react';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaDownload } from 'react-icons/fa';

const Card = ({ data }) => {
    const downloadVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name} (${data.callsign})
N:${data.name};;;;
ORG:Amateur Radio - ${data.callsign}
${data.phone ? `TEL;TYPE=CELL:${data.phone}` : ''}
${data.email ? `EMAIL:${data.email}` : ''}
${data.address ? `ADR;TYPE=HOME:;;${data.address};;;;` : ''}
NOTE:Malaysian Amateur Radio Operator - ${data.callsign}\\nLocation: ${data.location}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.callsign}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', transition: 'all 0.3s ease', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                    {data.callsign}
                </h2>
                <span style={{
                    background: 'rgba(79, 172, 254, 0.2)',
                    color: 'var(--secondary)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    MALAYSIA
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <FaUser style={{ minWidth: '16px' }} />
                    <span style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '500' }}>{data.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <FaMapMarkerAlt style={{ minWidth: '16px' }} />
                    <span>{data.location}</span>
                </div>

                {data.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaPhone style={{ minWidth: '16px' }} />
                        <span>{data.phone}</span>
                    </div>
                )}

                {data.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaEnvelope style={{ minWidth: '16px' }} />
                        <a href={`mailto:${data.email}`} style={{ color: 'var(--secondary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                            {data.email}
                        </a>
                    </div>
                )}

                {data.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                        <FaHome style={{ minWidth: '16px', marginTop: '4px' }} />
                        <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{data.address}</span>
                    </div>
                )}

                <button
                    onClick={downloadVCard}
                    style={{
                        marginTop: '16px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <FaDownload /> Save to Contacts
                </button>
            </div>
        </div>
    );
};

export default Card;
