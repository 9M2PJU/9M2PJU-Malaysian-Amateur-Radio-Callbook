import React, { createContext, useState, useEffect, useContext } from 'react';

const PWAContext = createContext(null);

export const usePWA = () => useContext(PWAContext);

const DISMISSED_KEY = 'pwa_install_dismissed';

export const PWAProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // Check if user previously dismissed the prompt
    useEffect(() => {
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        if (dismissed === 'true') {
            setIsDismissed(true);
            console.log('🔧 PWA: User previously dismissed install prompt');
        }
    }, []);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            console.log('✅ PWA: beforeinstallprompt event fired');
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        console.log('🔧 PWA: Setting up beforeinstallprompt listener');
        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            setIsPromptVisible(false);
            // Clear dismissed flag when app is installed
            localStorage.removeItem(DISMISSED_KEY);
            setIsDismissed(false);
            console.log('✅ PWA: App was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const showInstallPrompt = () => {
        setIsPromptVisible(true);
    };

    const hideInstallPrompt = () => {
        setIsPromptVisible(false);
        // Mark as dismissed
        localStorage.setItem(DISMISSED_KEY, 'true');
        setIsDismissed(true);
        console.log('🔧 PWA: User dismissed install prompt');
    };

    const installFromPrompt = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`✅ PWA: User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsInstallable(false);
        setIsPromptVisible(false);

        if (outcome === 'accepted') {
            // Clear dismissed flag if user accepts
            localStorage.removeItem(DISMISSED_KEY);
            setIsDismissed(false);
        }
    };

    return (
        <PWAContext.Provider value={{
            isInstallable,
            isPromptVisible,
            isDismissed,
            showInstallPrompt,
            hideInstallPrompt,
            installFromPrompt
        }}>
            {children}
        </PWAContext.Provider>
    );
};
