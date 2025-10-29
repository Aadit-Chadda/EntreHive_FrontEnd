import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function PrivacyPolicy() {
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
              <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>Privacy</span>{' '}
              <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>Policy</span>
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
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  Welcome to EntreHive. We are committed to protecting your personal information and your right to privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                  our platform. Please read this privacy policy carefully.
                </p>
              </div>
            </LazyLoad>

            {/* Information We Collect */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  1. Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold font-roca-two mb-3 mt-6" style={{color: 'var(--primary-orange)'}}>
                  Personal Information
                </h3>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We collect personal information that you voluntarily provide to us when you register on the platform, 
                  including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Name and email address</li>
                  <li>University affiliation and role (student, faculty, etc.)</li>
                  <li>Profile information (bio, skills, interests)</li>
                  <li>Project and post content</li>
                  <li>Communication data and interactions with other users</li>
                </ul>

                <h3 className="text-xl font-semibold font-roca-two mb-3 mt-6" style={{color: 'var(--primary-orange)'}}>
                  Automatically Collected Information
                </h3>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We automatically collect certain information when you visit, use, or navigate the platform, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Log and usage data (IP address, browser type, device information)</li>
                  <li>Activity data (posts, projects, interactions)</li>
                  <li>Performance and diagnostic data</li>
                </ul>
              </div>
            </LazyLoad>

            {/* How We Use Your Information */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  2. How We Use Your Information
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We use the information we collect or receive to:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li>Facilitate account creation and authentication</li>
                  <li>Provide and maintain our services</li>
                  <li>Connect users within university ecosystems</li>
                  <li>Enable project collaboration and communication</li>
                  <li>Send administrative information and updates</li>
                  <li>Improve and personalize user experience</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Information Sharing */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  3. How We Share Your Information
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li><strong>With Other Users:</strong> Your profile information and public posts are visible to other users within your university network</li>
                  <li><strong>With Universities:</strong> We may share aggregated, non-identifiable data with participating universities</li>
                  <li><strong>Service Providers:</strong> We may share data with third-party service providers who perform services on our behalf</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales, your information may be transferred</li>
                </ul>
              </div>
            </LazyLoad>

            {/* Data Security */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  4. Data Security
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  We implement appropriate technical and organizational security measures to protect your personal information. 
                  However, no electronic transmission or storage is 100% secure, and we cannot guarantee absolute security. 
                  We use industry-standard encryption, secure servers, and regular security assessments to protect your data.
                </p>
              </div>
            </LazyLoad>

            {/* Data Retention */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  5. Data Retention
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
                  Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, 
                  we will delete or anonymize your personal information, except where we are required to retain it for legal purposes.
                </p>
              </div>
            </LazyLoad>

            {/* Your Rights */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  6. Your Privacy Rights
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                  <li><strong>Object:</strong> Object to processing of your personal information</li>
                </ul>
                <p className="font-canva-sans leading-relaxed mt-4" style={{color: 'var(--secondary-taupe)'}}>
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:support@entrehive.app" className="font-semibold hover:underline" style={{color: 'var(--primary-orange)'}}>
                    support@entrehive.app
                  </a>
                </p>
              </div>
            </LazyLoad>

            {/* Third-Party Links */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  7. Third-Party Websites and Services
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  Our platform may contain links to third-party websites and services. We are not responsible for the 
                  privacy practices of these third parties. We encourage you to review their privacy policies before 
                  providing any personal information.
                </p>
              </div>
            </LazyLoad>

            {/* Children&apos;s Privacy */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  8. Children&apos;s Privacy
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  Our platform is intended for users who are at least 18 years old or enrolled in a university. 
                  We do not knowingly collect personal information from children under 13. If you believe we have 
                  collected information from a child under 13, please contact us immediately.
                </p>
              </div>
            </LazyLoad>

            {/* Changes to Policy */}
            <LazyLoad animationType="fade-up">
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  9. Changes to This Privacy Policy
                </h2>
                <p className="font-canva-sans leading-relaxed" style={{color: 'var(--secondary-taupe)'}}>
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an 
                  updated &quot;Last Updated" date. We will notify you of material changes by posting the new Privacy Policy 
                  on this page and, where appropriate, through email or platform notifications. Your continued use of 
                  the platform after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </LazyLoad>

            {/* Contact Information */}
            <LazyLoad animationType="fade-up">
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  10. Contact Us
                </h2>
                <p className="font-canva-sans leading-relaxed mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 border-2" style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="font-canva-sans font-semibold mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    EntreHive Support
                  </p>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Email:{' '}
                    <a href="mailto:support@entrehive.app" className="font-semibold hover:underline" style={{color: 'var(--primary-orange)'}}>
                      support@entrehive.app
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

