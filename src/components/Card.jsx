import React from 'react';
import { useAuth } from './AuthContext';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaDownload, FaFacebook, FaGlobe, FaSearch, FaClock, FaAddressCard, FaCalendarAlt, FaTelegram } from 'react-icons/fa';
import { getLicenseStatus, formatExpiryDate } from '../utils/licenseStatus';

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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return added >= sevenDaysAgo;
};


import { MALAYSIAN_STATES } from '../constants';

const STATE_FLAGS = {
    'JOHOR': '/flags/flag-johor.svg',
    'KEDAH': '/flags/flag-kedah.svg',
    'KELANTAN': '/flags/flag-kelantan.svg',
    'MELAKA': '/flags/flag-melaka.svg',
    'NEGERI SEMBILAN': '/flags/flag-negeri-sembilan.svg',
    'PAHANG': '/flags/flag-pahang.svg',
    'PERAK': '/flags/flag-perak.svg',
    'PERLIS': '/flags/flag-perlis.svg',
    'PULAU PINANG': '/flags/flag-pulau-pinang.svg',
    'SABAH': '/flags/flag-sabah.svg',
    'SARAWAK': '/flags/flag-sarawak.svg',
    'SELANGOR': '/flags/flag-selangor.svg',
    'TERENGGANU': '/flags/flag-terengganu.svg',
    'KUALA LUMPUR': '/flags/flag-kuala-lumpur.svg',
    'LABUAN': '/flags/flag-labuan.svg',
    'PUTRAJAYA': '/flags/flag-putrajaya.svg'
};

const Card = ({ data, onEdit, onDelete }) => {
    const { user, isAdmin, isSuperAdmin } = useAuth();
    const licenseClass = getLicenseClass(data.callsign);
    const recentlyAdded = isRecentlyAdded(data.addedDate);
    const licenseStatus = getLicenseStatus(data.expiryDate);

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

    // Define buttonStyle for social buttons
    const buttonStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '6px',
        color: 'var(--text-muted)',
        padding: '6px 12px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
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
            {isAdmin && onEdit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(data);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: recentlyAdded ? (isSuperAdmin ? '160px' : '90px') : (isSuperAdmin ? '80px' : '10px'),
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

            {/* Super Admin Delete Button */}
            {isSuperAdmin && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(data);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: recentlyAdded ? '90px' : '10px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                    title="Super Admin Delete"
                >
                    🗑️ Delete
                </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                        {data.callsign}
                    </h2>
                    {/* Donator Badge - positioned near callsign */}
                    {data.isDonator && (
                        <span style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%)',
                            color: '#ffd700',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            border: '1px solid rgba(255, 215, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                        }}>
                            ❤️ Donator
                        </span>
                    )}
                </div>
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
                    {/* License Status Badge */}
                    {licenseStatus && (
                        <span
                            style={{
                                background: licenseStatus.bg,
                                color: licenseStatus.color,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                border: `1px solid ${licenseStatus.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'help'
                            }}
                            title={`License expires: ${formatExpiryDate(data.expiryDate)}${licenseStatus.daysUntilExpiry >= 0 ? ` (${licenseStatus.daysUntilExpiry} days)` : ''}`}
                        >
                            {licenseStatus.icon} {licenseStatus.label}
                        </span>
                    )}
                    {/* Telegram Reminder Badge */}
                    {data.telegramChatId && (
                        <span
                            style={{
                                background: 'rgba(0, 136, 204, 0.15)',
                                color: '#29b6f6',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                border: '1px solid rgba(41, 182, 246, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'help'
                            }}
                            title="Receiving license expiry reminders via Telegram"
                        >
                            📲 TG Reminder
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <FaUser style={{ minWidth: '16px' }} />
                    <span style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '500' }}>{data.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <FaMapMarkerAlt style={{ minWidth: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{data.location}</span>
                        {data.district && (
                            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{data.district}</span>
                        )}
                    </div>
                </div>

                {data.gridLocator && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaGlobe style={{ minWidth: '16px' }} />
                        <span style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                            GRID: {data.gridLocator}
                        </span>
                    </div>
                )}

                {data.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaPhone style={{ minWidth: '16px' }} />
                        <a
                            href={`https://wa.me/${data.phone.replace(/[^0-9]/g, '').replace(/^0/, '60')}?text=${encodeURIComponent('Hello, I got your number from MY-Callbook https://callbook.hamradio.my !')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--secondary)', textDecoration: 'none' }}
                            title="Chat on WhatsApp"
                        >
                            {data.phone} <img src="/whatsapp-icon.png" alt="WhatsApp" style={{ height: '18px', width: '18px', verticalAlign: 'middle', marginLeft: '6px' }} />
                        </a>
                    </div>
                )}

                {data.telegramUsername && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaTelegram style={{ minWidth: '16px', color: '#29b6f6' }} />
                        <a
                            href={`https://t.me/${data.telegramUsername.replace(/^@/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#29b6f6', textDecoration: 'none' }}
                            title="Chat on Telegram"
                        >
                            {data.telegramUsername.startsWith('@') ? data.telegramUsername : `@${data.telegramUsername}`}
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

                {data.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaHome style={{ minWidth: '16px', marginTop: '4px' }} />
                        <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{data.address}</span>
                    </div>
                )}

                {data.expiryDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <FaCalendarAlt style={{ minWidth: '16px' }} />
                        <span>
                            License Expires: <span style={{ color: licenseStatus?.color || 'var(--text-main)' }}>{formatExpiryDate(data.expiryDate)}</span>
                        </span>
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
                {/* Social Media & Badges Section */}
                {(data.facebook || data.qrz || data.dmrId || data.martsId || data.meshtasticId || data.aprsCallsign || data.isPpmMember || data.isBsmmMember || data.isPppmMember || data.isVeteran) && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap', alignItems: 'center' }}>

                        {/* Define standard badge style for consistency */}
                        {(() => {
                            const standardBadgeStyle = {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px', // Standard padding
                                borderRadius: '6px',
                                fontSize: '0.85rem', // Standard font size
                                fontWeight: '600',
                                height: '34px',     // Fixed height for alignment
                                textDecoration: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.2s ease'
                            };

                            const badges = [
                                {
                                    show: data.facebook,
                                    type: 'link',
                                    href: data.facebook,
                                    label: 'Facebook',
                                    icon: <FaFacebook style={{ fontSize: '1.2rem' }} />,
                                    style: { background: 'rgba(24, 119, 242, 0.1)', color: '#1877f2', border: '1px solid rgba(24, 119, 242, 0.2)' }
                                },
                                {
                                    show: data.qrz,
                                    type: 'link',
                                    href: data.qrz,
                                    label: 'QRZ.com',
                                    image: '/qrz-logo.png',
                                    style: { background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)' }
                                },
                                {
                                    show: data.aprsCallsign,
                                    type: 'link',
                                    href: `https://aprs.fi/#!call=a%2F${encodeURIComponent(data.aprsCallsign)}&timerange=3600&tail=3600`,
                                    label: 'Track (APRS.fi)',
                                    image: '/aprs-icon.png',
                                    style: { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }
                                },
                                {
                                    show: data.dmrId,
                                    type: 'badge',
                                    label: data.dmrId,
                                    image: '/dmr-logo.png',
                                    style: { background: 'rgba(255, 255, 255, 0.1)', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.2)' },
                                    imgStyle: { width: '40px', borderRadius: '2px' }
                                },
                                {
                                    show: data.meshtasticId,
                                    type: 'badge',
                                    label: data.meshtasticId,
                                    image: '/meshtastic-logo.png',
                                    style: { background: 'rgba(103, 232, 157, 0.1)', color: '#67e89d', border: '1px solid rgba(103, 232, 157, 0.3)' },
                                    imgStyle: { borderRadius: '4px' }
                                },
                                {
                                    show: data.martsId,
                                    type: 'badge',
                                    label: `MARTS #${data.martsId}`,
                                    image: '/marts-logo.png',
                                    style: { background: 'rgba(255, 235, 59, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }
                                },
                                {
                                    show: data.isPpmMember,
                                    type: 'badge',
                                    label: 'PPM Member',
                                    image: '/ppm-logo.png',
                                    style: { background: 'rgba(59, 78, 180, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }
                                },
                                {
                                    show: data.isBsmmMember,
                                    type: 'badge',
                                    label: 'BSMM Member',
                                    image: '/bsmm-logo.png',
                                    style: { background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(248, 113, 113, 0.3)' }
                                },
                                {
                                    show: data.isPppmMember,
                                    type: 'badge',
                                    label: 'PPPM Member',
                                    image: '/pppm-logo.png',
                                    style: { background: 'rgba(37, 99, 235, 0.15)', color: '#93c5fd', border: '1px solid rgba(96, 165, 250, 0.3)' }
                                },
                                {
                                    show: data.isVeteran,
                                    type: 'badge',
                                    label: 'Military Veteran',
                                    image: '/jhev-logo.png',
                                    style: { background: 'rgba(75, 85, 99, 0.2)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.3)' }
                                }
                            ];

                            return badges.filter(b => b.show).map((badge, index) => {
                                const content = (
                                    <>
                                        {badge.icon && badge.icon}
                                        {badge.image && (
                                            <img
                                                src={badge.image}
                                                alt={badge.label}
                                                style={{
                                                    height: '20px',
                                                    width: 'auto',
                                                    objectFit: 'contain',
                                                    ...badge.imgStyle
                                                }}
                                            />
                                        )}
                                        <span>{badge.label}</span>
                                    </>
                                );

                                if (badge.type === 'link') {
                                    return (
                                        <a
                                            key={index}
                                            href={badge.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ ...standardBadgeStyle, ...badge.style }}
                                            title={badge.label}
                                        >
                                            {content}
                                        </a>
                                    );
                                }

                                return (
                                    <div
                                        key={index}
                                        style={{ ...standardBadgeStyle, ...badge.style }}
                                        title={badge.label}
                                    >
                                        {content}
                                    </div>
                                );
                            });
                        })()}
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

export default React.memo(Card);
