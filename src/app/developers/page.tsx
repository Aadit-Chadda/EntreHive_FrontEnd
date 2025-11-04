'use client';

import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function Developers() {
  return (
    <div style={{background: 'var(--background)'}}>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden hexagon-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <LazyLoad animationType="fade-up">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl"
                  style={{color: 'var(--secondary-charcoal)'}}>
                <span className="block">Meet the</span>
                <span className="block" style={{color: 'var(--primary-orange)'}}>Developers</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl font-canva-sans"
                 style={{color: 'var(--secondary-taupe)'}}>
                The talented individuals behind EntreHive
              </p>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Developer Info Section */}
      <section className="py-16 md:py-20" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 text-center"
                   style={{borderColor: 'var(--primary-orange)'}}>
                <div className="mb-6">
                  {/* Profile Picture */}
                  <div className="inline-block mb-4">
                    <img
                      src="/girik.jpg"
                      alt="Girik Manchanda"
                      className="w-32 h-32 rounded-full object-cover border-4"
                      style={{borderColor: 'var(--primary-orange)'}}
                    />
                  </div>

                  {/* Name */}
                  <h2 className="text-3xl font-extrabold font-roca-two mb-2"
                      style={{color: 'var(--secondary-charcoal)'}}>
                    Girik Manchanda
                  </h2>

                  {/* Title */}
                  <p className="text-xl font-semibold font-canva-sans mb-4"
                     style={{color: 'var(--primary-orange)'}}>
                    Creator & Full Stack Developer
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    {/* Website */}
                    <a
                      href="https://girik.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      style={{color: 'var(--secondary-taupe)'}}
                    >
                      <span className="sr-only">Website</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/girik-manchanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      style={{color: 'var(--secondary-taupe)'}}
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>

                    {/* GitHub */}
                    <a
                      href="https://github.com/Girik1105"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      style={{color: 'var(--secondary-taupe)'}}
                    >
                      <span className="sr-only">GitHub</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg font-canva-sans leading-relaxed mb-2"
                   style={{color: 'var(--secondary-taupe)'}}>
                  I'm a Full Stack Developer with a passion for building elegant solutions to complex problems. With experience in both frontend and backend development, I strive to create applications that are not only functional but also provide an exceptional user experience.{' '}
                  <a
                    href="https://girik.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline transition-all duration-200"
                    style={{color: 'var(--primary-orange)'}}
                  >
                    More about me here
                  </a>
                </p>
              </div>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-base font-semibold font-canva-sans hover:scale-105 transition-all duration-200"
            style={{color: 'var(--primary-orange)'}}
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
