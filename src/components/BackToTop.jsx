import React, { useState, useEffect } from 'react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    const toggleVisibility = () => {
        // Show after 100px of scrolling
        if (window.scrollY > 100) {
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
        // Check visibility immediately on mount in case we are already scrolled
        toggleVisibility();

        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div
            className={`fixed bottom-6 right-6 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            style={{ zIndex: 99999 }}
        >
            <button
                type="button"
                onClick={scrollToTop}
                style={{
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    color: '#000',
                    boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)'
                }}
                className="p-3 rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-transform duration-200 flex items-center justify-center"
                aria-label="Back to top"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default BackToTop;
