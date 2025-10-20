'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(
          `${apiUrl}/api/accounts/verify-email/${params.uid}/${params.token}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect after 3 seconds
          setIsRedirecting(true);
          setTimeout(() => {
            router.push('/profile');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email. The link may be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
        console.error('Verification error:', error);
      }
    };

    if (params.uid && params.token) {
      verifyEmail();
    }
  }, [params.uid, params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background)'}}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{backgroundColor: 'var(--surface)', border: '1px solid var(--border)'}}
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16" style={{color: 'var(--primary)'}} />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
              Verifying Your Email
            </h1>
            <p style={{color: 'var(--text-secondary)'}}>
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="inline-block mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
              Email Verified!
            </h1>
            <p className="mb-6" style={{color: 'var(--text-secondary)'}}>
              {message}
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--neutral-light-orange)'}}>
                <p className="text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                  Your account is now fully verified and active!
                </p>
              </div>
              {isRedirecting && (
                <p className="text-sm" style={{color: 'var(--text-muted)'}}>
                  Redirecting to your profile in a few seconds...
                </p>
              )}
              <button
                onClick={() => router.push('/profile')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: 'white'
                }}
              >
                Go to Profile
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="inline-block mb-6"
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
              Verification Failed
            </h1>
            <p className="mb-6" style={{color: 'var(--text-secondary)'}}>
              {message}
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#FEF3C7', border: '1px solid #F59E0B'}}>
                <p className="text-sm font-medium" style={{color: '#78350F'}}>
                  This link may have expired. You can request a new verification email from your profile.
                </p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: 'white'
                }}
              >
                Go to Profile
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                Go to Home
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

