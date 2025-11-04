import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function TermsOfService() {
  return (
    <div style={{background: 'var(--background)'}}>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden hexagon-pattern">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans" 
                   style={{background: 'var(--primary-orange)', color: 'white'}}>
                <span className="font-roca-two">Legal</span>
              </div>
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>Terms of</span>{' '}
              <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>Service</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base font-canva-sans sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-up stagger-2"
               style={{color: 'var(--secondary-taupe)'}}>
              Last Updated: October 4, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            
            {/* Introduction */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  Introduction
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  Welcome to EntreHive. These Terms of Service ("Terms") govern your access to and use of our platform, 
                  including our website, mobile applications, and related services (collectively, the &quot;Service&quot;). 
                  By accessing or using the Service, you agree to be bound by these Terms.
                </p>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  If you do not agree to these Terms, please do not use the Service.
                </p>
              </div>
            </LazyLoad>

            {/* Eligibility */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  1. Eligibility
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  To use EntreHive, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
                  <li>Be affiliated with a participating university as a student, faculty member, or authorized user</li>
                  <li>Have the authority to enter into these Terms</li>
                  <li>Not be prohibited from using the Service under applicable laws</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Account Registration */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  2. Account Registration and Security
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate and current</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  You may not use another user&apos;s account, share your account credentials, or create multiple accounts.
                </p>
              </div>
            </LazyLoad>

            {/* User Conduct */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  3. User Conduct and Prohibited Activities
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Violating any applicable laws, regulations, or third-party rights</li>
                  <li>Posting false, misleading, or fraudulent content</li>
                  <li>Harassing, threatening, or discriminating against other users</li>
                  <li>Uploading viruses, malware, or other harmful code</li>
                  <li>Attempting to gain unauthorized access to the Service or other users' accounts</li>
                  <li>Scraping, data mining, or using automated tools without permission</li>
                  <li>Impersonating another person or entity</li>
                  <li>Posting spam, promotional content, or unsolicited messages</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Interfering with or disrupting the Service&apos;s functionality</li>
                </ul>
              </div>
            </LazyLoad>

            {/* User Content */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  4. User Content
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  You retain ownership of content you post on EntreHive (&quot;User Content&quot;). By posting User Content, you grant us:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  <li>A worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display your User Content</li>
                  <li>The right to sublicense these rights to our service providers and partners</li>
                  <li>Permission to use your name and likeness in connection with your User Content</li>
                </ul>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>You own or have the necessary rights to post your User Content</li>
                  <li>Your User Content does not violate these Terms or applicable laws</li>
                  <li>Your User Content does not infringe on third-party rights</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Intellectual Property */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  5. Intellectual Property Rights
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  The Service, including its design, functionality, text, graphics, logos, and software, is owned by 
                  EntreHive and protected by copyright, trademark, and other intellectual property laws. Except for 
                  User Content, you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Copy, modify, or create derivative works of the Service</li>
                  <li>Reverse engineer or decompile any part of the Service</li>
                  <li>Use our trademarks or branding without permission</li>
                  <li>Remove or alter any proprietary notices</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Projects and Collaborations */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  6. Projects and Collaborations
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  EntreHive facilitates connections and collaborations but is not a party to any agreements between users. 
                  You acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>EntreHive is not responsible for the conduct of other users or the outcome of projects</li>
                  <li>You are solely responsible for your interactions and agreements with other users</li>
                  <li>We recommend creating written agreements for collaborations and seeking legal advice when necessary</li>
                  <li>EntreHive does not guarantee the success or completion of any project</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Investment and Financial Transactions */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  7. Investment and Financial Transactions
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  If you engage in investment activities through the platform:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>EntreHive is not a financial advisor, broker, or investment firm</li>
                  <li>We do not provide investment advice or recommendations</li>
                  <li>You are responsible for conducting your own due diligence</li>
                  <li>All investment decisions are made at your own risk</li>
                  <li>You should consult with financial and legal professionals before making investment decisions</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Disclaimers */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  8. Disclaimers
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  THE SERVICE IS PROVIDED "AS IS" AND &quot;AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Limitation of Liability */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  9. Limitation of Liability
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ENTREHIVE SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Damages arising from your use or inability to use the Service</li>
                  <li>Damages arising from interactions with other users</li>
                  <li>Unauthorized access to or alteration of your content or data</li>
                </ul>
                <p className="font-canva-sans leading-relaxed mt-4" style={{color: 'var(--secondary-taupe)'}}>
                  Our total liability for any claims shall not exceed the amount you paid us in the twelve months 
                  preceding the claim, or $100, whichever is greater.
                </p>
              </div>
            </LazyLoad>

            {/* Indemnification */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  10. Indemnification
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  You agree to indemnify, defend, and hold harmless EntreHive and its officers, directors, employees, 
                  and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable 
                  attorneys' fees) arising from: (a) your use of the Service; (b) your User Content; (c) your violation 
                  of these Terms; or (d) your violation of any rights of another party.
                </p>
              </div>
            </LazyLoad>

            {/* Termination */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  11. Termination
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We may suspend or terminate your access to the Service at any time, with or without cause or notice, 
                  including if:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  <li>You violate these Terms</li>
                  <li>Your conduct poses legal liability or harms other users</li>
                  <li>We discontinue the Service or any part thereof</li>
                </ul>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  You may terminate your account at any time by contacting us or using account settings. Upon termination, 
                  your right to use the Service will immediately cease.
                </p>
              </div>
            </LazyLoad>

            {/* Dispute Resolution */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  12. Dispute Resolution
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  If you have a dispute with EntreHive, you agree to first contact us at{' '}
                  <a href="mailto:support@entrehive.ca" className="font-semibold hover:underline" style={{color: 'var(--primary-orange)'}}>
                    support@entrehive.ca
                  </a>{' '}
                  to attempt to resolve the dispute informally. Any disputes that cannot be resolved informally shall be
                  governed by the laws of the jurisdiction where EntreHive is registered, without regard to conflict of law principles.
                </p>
              </div>
            </LazyLoad>

            {/* Changes to Terms */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  13. Changes to These Terms
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by 
                  posting the updated Terms on the platform and updating the &quot;Last Updated" date. Your continued use 
                  of the Service after changes become effective constitutes acceptance of the updated Terms. If you 
                  do not agree to the changes, you must stop using the Service.
                </p>
              </div>
            </LazyLoad>

            {/* General Provisions */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  14. General Provisions
                </h2>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and EntreHive</li>
                  <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions will remain in effect</li>
                  <li><strong>Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver</li>
                  <li><strong>Assignment:</strong> You may not assign these Terms without our consent; we may assign them freely</li>
                  <li><strong>No Third-Party Beneficiaries:</strong> These Terms do not create rights for third parties</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Contact Information */}
            <LazyLoad animationType="fade-up">
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  15. Contact Us
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 border-2" style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="font-canva-sans font-semibold mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    EntreHive Support
                  </p>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Email:{' '}
                    <a href="mailto:support@entrehive.ca" className="font-semibold hover:underline" style={{color: 'var(--primary-orange)'}}>
                      support@entrehive.ca
                    </a>
                  </p>
                </div>
              </div>
            </LazyLoad>

          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium font-canva-sans rounded-lg hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'var(--primary-orange)',
                color: 'white'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

