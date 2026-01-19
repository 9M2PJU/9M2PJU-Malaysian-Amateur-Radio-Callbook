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
            className={`transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 99999
            }}
        >
            <button
                type="button"
                onClick={scrollToTop}
                style={{
                    width: '3.5rem',
                    height: '3.5rem',
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
                className="hover:scale-110 group"
                aria-label="Back to top"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        color: 'var(--primary)',
                        filter: 'drop-shadow(0 0 5px var(--primary))'
                    }}
                    className="group-hover:text-white transition-colors duration-300"
                >
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            </button>
        </div>
    );
};

export default BackToTop;
