import React, { useEffect } from 'react';
import { MdSmartphone, MdFlashOn, MdNotifications, MdOfflinePin, MdClose } from 'react-icons/md';
import { useAuth } from './AuthContext';
import { usePWA } from './PWAContext';

const PWAInstallPrompt = () => {
    const { user } = useAuth();
    const { isPromptVisible, showInstallPrompt, hideInstallPrompt, installFromPrompt, isInstallable } = usePWA();

    // Auto-show logic: If installable and logged in, show the prompt
    useEffect(() => {
        console.log('🔧 PWAInstallPrompt: Auto-show check', { isInstallable, hasUser: !!user });
        if (isInstallable && user) {
            // We can check if we already showed it this session/user preference here if needed.
            // For now, simpler is better.
            console.log('✅ PWAInstallPrompt: Auto-showing install prompt');
            showInstallPrompt();
        }
    }, [isInstallable, user]);

    if (!isPromptVisible) return null;

    return (
        <div className="pwa-overlay">
            <div className="pwa-modal">
                <button
                    onClick={hideInstallPrompt}
                    className="pwa-close-btn"
                >
                    <MdClose size={24} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="pwa-icon-container">
                        <MdSmartphone style={{ color: 'white', fontSize: '1.875rem' }} />
                    </div>

                    <h2 className="pwa-title">Add MY-Callbook to Homescreen</h2>
                    <p className="pwa-text">
                        Access MY-Callbook faster! Install as an app for the best experience.
                    </p>

                    <div className="pwa-features">
                        <div className="pwa-feature-item">
                            <MdFlashOn className="pwa-feature-icon" />
                            <span>Fast access from homescreen</span>
                        </div>
                        <div className="pwa-feature-item">
                            <MdNotifications className="pwa-feature-icon" />
                            <span>Latest event notifications</span>
                        </div>
                        <div className="pwa-feature-item">
                            <MdOfflinePin className="pwa-feature-icon" />
                            <span>Works offline</span>
                        </div>
                    </div>

                    <button
                        onClick={installFromPrompt}
                        className="pwa-btn-install"
                    >
                        Install Now
                    </button>

                    <button
                        onClick={hideInstallPrompt}
                        className="pwa-btn-later"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
