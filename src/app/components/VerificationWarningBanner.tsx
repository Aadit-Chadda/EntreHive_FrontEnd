'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Mail, Clock } from 'lucide-react';

interface VerificationWarningBannerProps {
  daysUntilDisabled: number | null;
  onResendEmail: () => void;
  isResending?: boolean;
}

export default function VerificationWarningBanner({
  daysUntilDisabled,
  onResendEmail,
  isResending = false
}: VerificationWarningBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const days = daysUntilDisabled ?? 30;
  const isUrgent = days <= 7;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-6 rounded-lg p-4 border-l-4"
        style={{
          backgroundColor: isUrgent ? '#FEF3C7' : '#FDEEDB',
          borderColor: isUrgent ? '#F59E0B' : 'var(--primary)',
          border: '1px solid',
          borderLeftWidth: '4px'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="flex-shrink-0 mr-3">
              <AlertTriangle
                className="w-6 h-6"
                style={{color: isUrgent ? '#F59E0B' : 'var(--primary)'}}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base font-semibold"
                  style={{color: isUrgent ? '#78350F' : 'var(--primary-dark)'}}
                >
                  Verify Your Email Address
                </h3>
                {isUrgent && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Urgent
                  </span>
                )}
              </div>
              <p
                className="text-sm mb-3"
                style={{color: isUrgent ? '#78350F' : 'var(--text-primary)'}}
              >
                You have <strong>{days} {days === 1 ? 'day' : 'days'}</strong> remaining to verify your email address.
                Your account will be temporarily disabled if not verified within this timeframe.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={onResendEmail}
                  disabled={isResending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    color: 'white'
                  }}
                >
                  {isResending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock className="w-4 h-4" />
                      </motion.div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 text-xs" style={{color: 'var(--text-muted)'}}>
                  <Mail className="w-3 h-3" />
                  <span>Check your spam folder if you don&apos;t see the email</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-2 p-1 rounded-md transition-colors hover:bg-black/5"
            style={{color: 'var(--text-muted)'}}
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

