import React, { createContext, useState, useEffect, useContext } from 'react';

const PWAContext = createContext(null);

export const usePWA = () => useContext(PWAContext);

export const PWAProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            setIsPromptVisible(false);
            console.log('PWA was installed');
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
    };

    const installFromPrompt = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsInstallable(false);
        setIsPromptVisible(false);
    };

    return (
        <PWAContext.Provider value={{
            isInstallable,
            isPromptVisible,
            showInstallPrompt,
            hideInstallPrompt,
            installFromPrompt
        }}>
            {children}
        </PWAContext.Provider>
    );
};
