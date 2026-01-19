import React, { useState, useEffect } from 'react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div
            className={`fixed right-4 bottom-4 md:right-8 md:bottom-8 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            style={{
                zIndex: 99999
            }}
        >
            <button
                type="button"
                onClick={scrollToTop}
                style={{
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.9)', // Dark background
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                className="hover:scale-110 group w-10 h-10 md:w-14 md:h-14"
                aria-label="Back to top"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        color: 'var(--primary)',
                        filter: 'drop-shadow(0 0 5px var(--primary))'
                    }}
                    className="group-hover:text-white transition-colors duration-300 w-5 h-5 md:w-7 md:h-7"
                >
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            </button>
        </div>
    );
};

export default BackToTop;
