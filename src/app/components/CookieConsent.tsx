'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      // Show popup after a short delay
      setTimeout(() => {
        setShowConsent(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div 
            className="rounded-xl shadow-2xl p-6 border-2"
            style={{
              backgroundColor: 'white',
              borderColor: 'var(--primary-orange)'
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-3xl">🍪</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold font-roca-two text-lg mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  We use cookies
                </h3>
                <p className="text-sm font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "I Understand", you consent to our use of cookies.
                </p>
                <button
                  onClick={handleAccept}
                  className="w-full px-6 py-3 rounded-lg font-semibold font-canva-sans text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  style={{backgroundColor: 'var(--primary-orange)'}}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

