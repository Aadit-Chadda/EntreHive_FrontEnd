import React from 'react';
import { EnvelopeIcon, CheckCircleIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function EmailSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Email System Overview</h1>
        <p className="text-lg text-secondary-charcoal">
          Complete email system with branded templates, verification, and password management
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Email Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-terracotta-50 border border-orange-200 rounded-lg p-6">
            <EnvelopeIcon className="w-8 h-8 text-primary-orange mb-3" />
            <h3 className="font-bold text-primary-black mb-2">Welcome Email</h3>
            <p className="text-sm text-gray-600">Sent automatically on registration with platform overview</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <CheckCircleIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-primary-black mb-2">Email Verification</h3>
            <p className="text-sm text-gray-600">30-day verification requirement for all users</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <LockClosedIcon className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-primary-black mb-2">Password Reset</h3>
            <p className="text-sm text-gray-600">Secure password reset with 24-hour token expiration</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <ShieldCheckIcon className="w-8 h-8 text-pine-green mb-3" />
            <h3 className="font-bold text-primary-black mb-2">Password Changed</h3>
            <p className="text-sm text-gray-600">Confirmation email with security details</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Design System</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-primary-orange"></div>
                <p className="text-xs font-mono">#F3AC3B</p>
                <p className="text-xs text-gray-600">Primary Orange</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-accent-terracotta"></div>
                <p className="text-xs font-mono">#E79F74</p>
                <p className="text-xs text-gray-600">Accent Terracotta</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-secondary-taupe"></div>
                <p className="text-xs font-mono">#8A6B53</p>
                <p className="text-xs text-gray-600">Secondary Taupe</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-accent-pine"></div>
                <p className="text-xs font-mono">#214F38</p>
                <p className="text-xs text-gray-600">Accent Pine</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Typography</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Font Family:</span> System fonts (Apple, Segoe UI, Roboto)</p>
              <p><span className="font-semibold">Logo:</span> 36px, Bold</p>
              <p><span className="font-semibold">Headings:</span> 26px, Semi-bold</p>
              <p><span className="font-semibold">Body:</span> 16px, Regular</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Layout</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Max Width:</span> 600px (email-safe)</p>
              <p><span className="font-semibold">Structure:</span> Header → Content → Footer</p>
              <p><span className="font-semibold">Responsive:</span> Mobile-optimized with media queries</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Email Templates</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-primary-black">1. Welcome Email</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600">Welcome to Entrehive</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Trigger:</p>
                <p className="text-sm text-gray-600">Automatically sent on user registration via Django signal</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Content:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Personalized greeting with user's name</li>
                  <li>Platform features overview (Share ideas, Build network, Showcase projects)</li>
                  <li>"Get Started" CTA button linking to frontend</li>
                  <li>Quick tip about completing profile</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Template Files:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">accounts/templates/accounts/emails/welcome.html</code>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-primary-black">2. Email Verification</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600">Verify Your Entrehive Email Address</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Trigger:</p>
                <p className="text-sm text-gray-600">Automatically sent on registration; can be resent via API</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Content:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Large "Verify Email Address" button with token URL</li>
                  <li>Prominent warning: "You have 30 days to verify"</li>
                  <li>Alternative link if button doesn't work</li>
                  <li>Explanation of why verification is needed</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Security:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>Account disabled after 30 days if not verified</li>
                  <li>Applies to ALL users (students, professors, investors)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-primary-black">3. Password Reset</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600">Reset Your Entrehive Password</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Trigger:</p>
                <p className="text-sm text-gray-600">User requests password reset via <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/api/auth/password/reset/</code></p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Content:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Lock icon (🔐) for visual security indicator</li>
                  <li>Large "Reset My Password" button</li>
                  <li>24-hour expiration notice</li>
                  <li>Security warnings if user didn't request reset</li>
                  <li>Alternative link for copy/paste</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Security Features:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>Token-based with expiration</li>
                  <li>One-time use tokens</li>
                  <li>Clear unauthorized request warnings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-primary-black">4. Password Changed Confirmation</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600">Your Entrehive Password Was Changed</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Trigger:</p>
                <p className="text-sm text-gray-600">After successful password reset confirmation</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Content:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Success checkmark visual</li>
                  <li>Pine green success theme</li>
                  <li>Password change details (date, time, IP address)</li>
                  <li>Security alert if user didn't make change</li>
                  <li>"Contact Support" button for unauthorized changes</li>
                  <li>Pro tip: Enable 2FA (future feature)</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Security Tracking:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>Timestamp of change</li>
                  <li>IP address logging</li>
                  <li>Device/browser information (if available)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function EmailVerification() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Email Verification System</h1>
        <p className="text-lg text-secondary-charcoal">
          Comprehensive email verification with 30-day deadline for all users
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Verification Flow</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">User Registers</h3>
              <p className="text-sm text-gray-600">New account created via registration form</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Emails Sent</h3>
              <p className="text-sm text-gray-600">Django signal triggers both welcome and verification emails</p>
              <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded mt-1 block">
                Signal: post_save on User model
              </code>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">User Clicks Link</h3>
              <p className="text-sm text-gray-600">User clicks verification button/link in email</p>
              <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded mt-1 block">
                URL: /verify-email/[uid]/[token]/
              </code>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Token Validated</h3>
              <p className="text-sm text-gray-600">Backend validates uid and token using Django's token generator</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-black mb-1">Email Verified</h3>
              <p className="text-sm text-gray-600">Profile updated: email_verified = True</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Backend Implementation</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Database Fields</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`# accounts/models.py - UserProfile model

email_verified = models.BooleanField(
    default=False,
    help_text="Has the user verified their email address"
)

verification_sent_at = models.DateTimeField(
    blank=True,
    null=True,
    help_text="When the verification email was sent"
)`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Helper Methods</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`def days_since_verification_sent(self):
    """Return number of days since verification email was sent"""
    if not self.verification_sent_at:
        return None
    delta = timezone.now() - self.verification_sent_at
    return delta.days

def should_disable_account(self):
    """Check if account should be disabled due to unverified email"""
    if self.email_verified:
        return False
    days = self.days_since_verification_sent()
    if days is not None and days >= 30:
        return True
    return False

def disable_account_if_unverified(self):
    """Disable account if email not verified within 30 days"""
    if self.should_disable_account() and self.user.is_active:
        self.user.is_active = False
        self.user.save()
        return True
    return False`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">API Endpoints</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">GET</span>
                  <code className="text-sm font-mono">/api/accounts/verify-email/&lt;uidb64&gt;/&lt;token&gt;/</code>
                </div>
                <p className="text-sm text-gray-600 mb-2">Verify user's email address using token from email</p>
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Success Response:</p>
                  <div className="bg-gray-900 text-gray-100 rounded p-2">
                    <code>{`{ "message": "Email verified successfully", "verified": true }`}</code>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">POST</span>
                  <code className="text-sm font-mono">/api/accounts/resend-verification/</code>
                </div>
                <p className="text-sm text-gray-600 mb-2">Resend verification email to authenticated user</p>
                <div className="text-xs space-y-2">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Headers:</p>
                    <div className="bg-gray-900 text-gray-100 rounded p-2">
                      <code>Authorization: Bearer &lt;token&gt;</code>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Success Response:</p>
                    <div className="bg-gray-900 text-gray-100 rounded p-2">
                      <code>{`{ "message": "Verification email sent successfully" }`}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Frontend Implementation</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Verification Page</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create a page at <code className="bg-gray-100 px-2 py-1 rounded">/verify-email/[uid]/[token]/page.tsx</code>
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          \`\${process.env.NEXT_PUBLIC_API_URL}/api/accounts/verify-email/\${params.uid}/\${params.token}/\`
        );
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => router.push('/profile'), 3000);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [params.uid, params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'loading' && <div>Verifying your email...</div>}
      {status === 'success' && (
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Email Verified!
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <div className="text-6xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>
      )}
    </div>
  );
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Warning Banner Component</h3>
            <p className="text-sm text-gray-600 mb-3">
              Display verification warning when user hasn't verified email
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`{profile.should_show_verification_warning && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" /* warning icon */ />
      </div>
      <div className="ml-3">
        <p className="text-sm text-yellow-700">
          <strong>Verify your email address</strong>
          <br />
          You have {profile.days_until_disabled} days remaining to verify 
          your email or your account will be temporarily disabled.
        </p>
        <button 
          onClick={handleResendVerification}
          className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600"
        >
          Resend verification email
        </button>
      </div>
    </div>
  </div>
)}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Resend Verification Function</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`const handleResendVerification = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      \`\${process.env.NEXT_PUBLIC_API_URL}/api/accounts/resend-verification/\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${token}\`,
        },
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      toast.success('Verification email sent! Check your inbox.');
    } else {
      toast.error(data.error || 'Failed to send verification email');
    }
  } catch (error) {
    toast.error('An error occurred. Please try again.');
  }
};`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Profile API Fields</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-3">
            The profile endpoint (<code>/api/accounts/profile/me/</code>) returns verification status:
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`{
  "email_verified": false,
  "verification_sent_at": "2025-10-20T10:30:00Z",
  "days_until_disabled": 25,
  "should_show_verification_warning": true,
  // ... other profile fields
}`}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Important Notes</h2>
        
        <div className="space-y-3">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <h3 className="font-semibold text-red-800 mb-1">⚠️ Required for ALL Users</h3>
            <p className="text-sm text-red-700">
              Email verification is required for students, professors, AND investors. 
              No exceptions. Accounts will be disabled after 30 days if not verified.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="font-semibold text-blue-800 mb-1">ℹ️ Different from University Verification</h3>
            <p className="text-sm text-blue-700">
              Email verification (proves email ownership) is separate from university verification 
              (institutional email domain check). Students/professors need both; investors only need email verification.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="font-semibold text-green-800 mb-1">✓ Token Security</h3>
            <p className="text-sm text-green-700">
              Uses Django's default_token_generator. Tokens are one-time use and expire automatically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function EmailTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Email Template Details</h1>
        <p className="text-lg text-secondary-charcoal">
          In-depth look at email template structure and customization
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Template Structure</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">File Organization</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`accounts/templates/accounts/emails/
├── welcome.html              # HTML template
├── welcome.txt               # Plain text fallback
├── email_verification.html   # HTML template
├── email_verification.txt    # Plain text fallback
├── password_reset.html       # HTML template
├── password_reset.txt        # Plain text fallback
├── password_changed.html     # HTML template
└── password_changed.txt      # Plain text fallback`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Common Template Structure</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start">
                <span className="font-semibold w-32">Header:</span>
                <span className="flex-1">Branded gradient with logo and subtitle</span>
              </p>
              <p className="flex items-start">
                <span className="font-semibold w-32">Content Area:</span>
                <span className="flex-1">Large icon, greeting, message, CTA button</span>
              </p>
              <p className="flex items-start">
                <span className="font-semibold w-32">Info Boxes:</span>
                <span className="flex-1">Color-coded boxes for warnings, tips, details</span>
              </p>
              <p className="flex items-start">
                <span className="font-semibold w-32">Footer:</span>
                <span className="flex-1">Company name, links, copyright</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Template Variables</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Welcome Email</h3>
            <div className="space-y-2 text-sm">
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_name</code> - User's full name or username</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_email</code> - User's email address</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">frontend_url</code> - Frontend base URL for links</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Email Verification</h3>
            <div className="space-y-2 text-sm">
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_name</code> - User's full name or username</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_email</code> - User's email address</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">verification_url</code> - Full verification URL with token</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">frontend_url</code> - Frontend base URL</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Password Reset</h3>
            <div className="space-y-2 text-sm">
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_name</code> - User's full name or username</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_email</code> - User's email address</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">reset_url</code> - Password reset URL with token</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">frontend_url</code> - Frontend base URL</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Password Changed</h3>
            <div className="space-y-2 text-sm">
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_name</code> - User's full name or username</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_email</code> - User's email address</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">change_date</code> - Formatted timestamp of change</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">user_ip</code> - IP address of request</p>
              <p><code className="bg-gray-100 px-2 py-1 rounded">frontend_url</code> - Frontend base URL</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Utility Functions</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            All email sending is handled by utility functions in <code className="bg-gray-100 px-2 py-1 rounded">accounts/email_utils.py</code>
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`# email_utils.py

def send_welcome_email(user, request=None):
    """Send welcome email to newly registered user"""
    # Returns: True if successful, False otherwise
    
def send_verification_email(user, verification_url):
    """Send email verification link to user"""
    # Returns: True if successful, False otherwise
    
def send_password_reset_email(user, reset_url):
    """Send password reset email with token"""
    # Returns: True if successful, False otherwise
    
def send_password_changed_email(user, request=None):
    """Send confirmation after password change"""
    # Returns: True if successful, False otherwise`}</code></pre>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Function Features</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Handles both HTML and plain text versions</li>
              <li>Uses Django's template rendering system</li>
              <li>Includes error handling and logging</li>
              <li>Returns success/failure status</li>
              <li>Supports request context for IP tracking</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Email Client Compatibility</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Gmail</p>
            <p className="text-xs text-green-600">Desktop & Mobile</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Outlook</p>
            <p className="text-xs text-green-600">2007-365</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Apple Mail</p>
            <p className="text-xs text-green-600">macOS & iOS</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Yahoo Mail</p>
            <p className="text-xs text-green-600">All versions</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Thunderbird</p>
            <p className="text-xs text-green-600">Desktop client</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <p className="font-semibold text-green-800">✓ Mobile Apps</p>
            <p className="text-xs text-green-600">iOS & Android</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-primary-black mb-2">Technical Details</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• All styles are inline for maximum compatibility</li>
            <li>• Table-based layout (email-safe, not divs)</li>
            <li>• Web-safe fonts with system font stack</li>
            <li>• No JavaScript (pure HTML/CSS)</li>
            <li>• Alt text for all images</li>
            <li>• Mobile-responsive with media queries</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Customization Guide</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Changing Colors</h3>
            <p className="text-sm text-gray-600 mb-2">Update gradient values in HTML templates:</p>
            <div className="bg-gray-900 text-gray-100 rounded p-3 text-xs">
              <code>background: linear-gradient(135deg, #F3AC3B 0%, #E79F74 52%, #8A6B53 100%);</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Changing Subject Lines</h3>
            <p className="text-sm text-gray-600 mb-2">Edit in email utility functions:</p>
            <div className="bg-gray-900 text-gray-100 rounded p-3 text-xs">
              <code>{`send_mail(
    subject='Your Custom Subject Here',
    // ...
)`}</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Adding Branding</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Replace emoji logo with <code className="bg-gray-100 px-1 py-0.5 rounded">&lt;img&gt;</code> tag (hosted image)</li>
              <li>• Update brand colors in all templates</li>
              <li>• Add social media icons/links in footer</li>
              <li>• Customize footer links (About, Help, Privacy)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export function EmailConfiguration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-black mb-2">Email Configuration</h1>
        <p className="text-lg text-secondary-charcoal">
          SMTP setup, environment variables, and deployment configuration
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Django Settings</h2>
        
        <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm"><code>{`# entrehive_backend/settings.py

# Email Backend Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP Settings (Gmail example)
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')

# Frontend URL for email links
if DEBUG:
    FRONTEND_URL = "http://localhost:3000"
else:
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Template Directory
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'accounts' / 'templates'],
        // ...
    },
]`}</code></pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Environment Variables</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in your backend directory:
          </p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm"><code>{`# .env file

# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=noreply@entrehive.com

# Frontend URL
FRONTEND_URL=http://localhost:3000  # Development
# FRONTEND_URL=https://yourdomain.com  # Production`}</code></pre>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-semibold text-yellow-800 mb-1">⚠️ Gmail App-Specific Passwords</h3>
            <p className="text-sm text-yellow-700">
              If using Gmail, you must create an App-Specific Password (not your regular password):
            </p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside mt-2 space-y-1">
              <li>Enable 2-Factor Authentication on your Google account</li>
              <li>Go to: Google Account → Security → App passwords</li>
              <li>Generate a new app password for "Mail"</li>
              <li>Use this 16-character password in EMAIL_HOST_PASSWORD</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Development vs Production</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Development</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Console Backend:</strong> Emails print to terminal</li>
              <li>• <strong>No SMTP:</strong> No actual emails sent</li>
              <li>• <strong>Fast Testing:</strong> Immediate feedback</li>
              <li>• <strong>Full HTML:</strong> See rendered HTML in console</li>
            </ul>
            <div className="mt-3 bg-gray-900 text-gray-100 rounded p-3 text-xs">
              <code>EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'</code>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-3">Production</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>SMTP Backend:</strong> Real email delivery</li>
              <li>• <strong>Credentials:</strong> SMTP server credentials required</li>
              <li>• <strong>SPF/DKIM:</strong> Configure for deliverability</li>
              <li>• <strong>Monitoring:</strong> Track bounce rates, opens</li>
            </ul>
            <div className="mt-3 bg-gray-900 text-gray-100 rounded p-3 text-xs">
              <code>EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'</code>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">SMTP Providers</h2>
        
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Gmail</h3>
            <div className="text-sm space-y-1">
              <p><strong>Host:</strong> smtp.gmail.com</p>
              <p><strong>Port:</strong> 587 (TLS) or 465 (SSL)</p>
              <p><strong>Limit:</strong> 500 emails/day (free), 2000/day (Workspace)</p>
              <p className="text-gray-600">Best for: Development and small-scale testing</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">SendGrid</h3>
            <div className="text-sm space-y-1">
              <p><strong>Free Tier:</strong> 100 emails/day</p>
              <p><strong>Features:</strong> Analytics, templates, deliverability tools</p>
              <p className="text-gray-600">Best for: Production with analytics needs</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">AWS SES</h3>
            <div className="text-sm space-y-1">
              <p><strong>Cost:</strong> $0.10 per 1,000 emails</p>
              <p><strong>Features:</strong> High volume, reliable, scalable</p>
              <p className="text-gray-600">Best for: Large-scale production deployments</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-black mb-2">Mailgun</h3>
            <div className="text-sm space-y-1">
              <p><strong>Free Tier:</strong> 5,000 emails/month</p>
              <p><strong>Features:</strong> Email validation, tracking, logs</p>
              <p className="text-gray-600">Best for: Production with detailed logging</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Testing Emails</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-black mb-2">Console Backend (Development)</h3>
            <p className="text-sm text-gray-600 mb-2">
              Change settings.py temporarily to see emails in terminal:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs">
              <code>{`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`}</code>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Testing Actions</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p>• <strong>Registration:</strong> Create new user → welcome + verification emails</p>
              <p>• <strong>Password Reset:</strong> Use forgot password form → reset email</p>
              <p>• <strong>Password Changed:</strong> Complete password reset → confirmation email</p>
              <p>• <strong>Resend Verification:</strong> Call resend API → verification email</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary-black mb-2">Manual Test via Django Shell</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm"><code>{`python manage.py shell

from django.contrib.auth.models import User
from accounts.email_utils import send_welcome_email, send_verification_email

# Get a test user
user = User.objects.first()

# Test welcome email
send_welcome_email(user)

# Test verification email
verification_url = "http://localhost:3000/verify-email/test/token/"
send_verification_email(user, verification_url)`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Production Checklist</h2>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>SMTP Credentials:</strong> Set up EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in environment variables
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>Frontend URL:</strong> Set FRONTEND_URL to production domain
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>From Email:</strong> Set DEFAULT_FROM_EMAIL to professional address (noreply@yourdomain.com)
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>SPF Records:</strong> Configure SPF records for your domain
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>DKIM:</strong> Set up DKIM signing with your email provider
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>Test Emails:</strong> Send test emails to Gmail, Outlook, Yahoo
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>Monitor Bounces:</strong> Set up bounce handling and monitoring
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1" disabled />
            <label className="text-sm text-gray-700">
              <strong>Spam Check:</strong> Test emails don't go to spam folder
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary-black mb-4">Troubleshooting</h2>
        
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Issue: Emails not sending</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Check SMTP credentials in .env file</li>
              <li>✓ Verify EMAIL_BACKEND is set to SMTP</li>
              <li>✓ Check Django logs for error messages</li>
              <li>✓ Test SMTP connection independently</li>
              <li>✓ Verify firewall allows port 587/465</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Issue: Emails go to spam</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Set up SPF and DKIM records</li>
              <li>✓ Use a professional FROM email address</li>
              <li>✓ Avoid spam trigger words in subject/content</li>
              <li>✓ Ensure HTML is well-formed</li>
              <li>✓ Include plain text alternative</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Issue: Links not working in emails</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Check FRONTEND_URL setting is correct</li>
              <li>✓ Verify token generation is working</li>
              <li>✓ Test URL format in email HTML</li>
              <li>✓ Check frontend route exists</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

