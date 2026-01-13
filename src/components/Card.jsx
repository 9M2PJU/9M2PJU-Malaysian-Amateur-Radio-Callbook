import React from 'react';
import { useAuth } from './AuthContext';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaDownload, FaFacebook, FaGlobe, FaSearch, FaClock } from 'react-icons/fa';

// Determine license class info
// 9M = Class A (Full License)
// 9W2, 9W6, 9W8 = Class B
// 9W3 = Class C
const getLicenseClass = (callsign) => {
    if (callsign.startsWith('9M')) return { name: 'Class A', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)' };
    if (callsign.startsWith('9W3')) return { name: 'Class C', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' };
    if (callsign.startsWith('9W2') || callsign.startsWith('9W6') || callsign.startsWith('9W8')) return { name: 'Class B', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' };
    return { name: 'Other', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.2)' };
};

// Check if recently added (within 30 days)
const isRecentlyAdded = (addedDate) => {
    if (!addedDate) return false;
    const added = new Date(addedDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return added >= thirtyDaysAgo;
};

const ADMIN_EMAIL = '9m2pju@hamradio.my';

const STATE_FLAGS = {
    'JOHOR': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Johor.svg',
    'KEDAH': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Flag_of_Kedah.svg',
    'KELANTAN': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Kelantan.svg',
    'MELAKA': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_Malacca.svg',
    'NEGERI SEMBILAN': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_Negeri_Sembilan.svg',
    'PAHANG': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Pahang.svg',
    'PERAK': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Flag_of_Perak.svg',
    'PERLIS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Flag_of_Perlis.svg/320px-Flag_of_Perlis.svg.png',
    'PULAU PINANG': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Penang_%28Malaysia%29.svg',
    'SABAH': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Sabah.svg',
    'SARAWAK': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Flag_of_Sarawak.svg',
    'SELANGOR': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Flag_of_Selangor.svg',
    'TERENGGANU': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Terengganu.svg',
    'KUALA LUMPUR': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Kuala_Lumpur_%28Malaysia%29.svg',
    'LABUAN': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Labuan.svg',
    'PUTRAJAYA': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Putrajaya.svg'
};

const Card = ({ data, onEdit }) => {
    const { user } = useAuth();
    const licenseClass = getLicenseClass(data.callsign);
    const recentlyAdded = isRecentlyAdded(data.addedDate);

    const downloadVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name} (${data.callsign})
N:${data.name};;;;
ORG:Amateur Radio - ${data.callsign}
${data.phone ? `TEL;TYPE=CELL:${data.phone}` : ''}
${data.email ? `EMAIL:${data.email}` : ''}
${data.address ? `ADR;TYPE=HOME:;;${data.address};;;;` : ''}
${data.website ? `URL:${data.website}` : ''}
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
        <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 24px)', transition: 'all 0.3s ease', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
            {/* Recently Added Badge */}
            {recentlyAdded && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'
                }}>
                    <FaClock /> NEW
                </div>
            )}

            {/* Admin Edit Button */}
            {user?.email === ADMIN_EMAIL && onEdit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(data);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: recentlyAdded ? '90px' : '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                    title="Admin Edit"
                >
                    ✏️ Edit
                </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                    {data.callsign}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* License Class Badge */}
                    <span style={{
                        background: licenseClass.bg,
                        color: licenseClass.color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${licenseClass.color}`
                    }}>
                        {licenseClass.name}
                    </span>
                    {/* Malaysia/State Badge */}
                    <span style={{
                        background: 'rgba(79, 172, 254, 0.2)',
                        color: 'var(--secondary)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {STATE_FLAGS[data.location] ? (
                            <>
                                <img
                                    src={STATE_FLAGS[data.location]}
                                    alt={data.location}
                                    style={{ width: '20px', height: 'auto', borderRadius: '2px', objectFit: 'cover' }}
                                />
                                {data.location}
                            </>
                        ) : (
                            <>🇲🇾 MALAYSIA</>
                        )}
                    </span>
                </div>
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
                        <a
                            href={`https://wa.me/${data.phone.replace(/[^0-9]/g, '').replace(/^0/, '60')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--secondary)', textDecoration: 'none' }}
                            title="Chat on WhatsApp"
                        >
                            {data.phone} 💬
                        </a>
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

                {data.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaGlobe style={{ minWidth: '16px' }} />
                        <a href={data.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                            {data.website.replace(/^https?:\/\//, '')}
                        </a>
                    </div>
                )}

                {/* Social Media Section */}
                {(data.facebook || data.qrz || data.dmrId || data.martsId) && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap', alignItems: 'center' }}>
                        {data.facebook && (
                            <a href={data.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontSize: '1.5rem' }} title="Facebook">
                                <FaFacebook />
                            </a>
                        )}
                        {data.qrz && (
                            <a href={data.qrz} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }} title="QRZ.com">
                                <img
                                    src="/qrz-logo.png"
                                    alt="QRZ.com"
                                    style={{ width: '40px', height: 'auto', borderRadius: '4px' }}
                                />
                            </a>
                        )}
                        {data.dmrId && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(168, 85, 247, 0.15)',
                                color: '#a855f7',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                🆔 DMR ID: {data.dmrId}
                            </div>
                        )}
                        {data.martsId && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 235, 59, 0.1)',
                                color: '#fbbf24', // Amber-400 for text
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                border: '1px solid rgba(251, 191, 36, 0.3)'
                            }} title="MARTS Member">
                                <img
                                    src="/marts-logo.png"
                                    alt="MARTS Logo"
                                    style={{ width: '20px', height: 'auto' }}
                                />
                                MARTS #{data.martsId}
                            </div>
                        )}
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
