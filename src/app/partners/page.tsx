'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

interface University {
  id: string;
  name: string;
  short_name?: string;
  city: string;
  state_province: string;
  country: string;
  website?: string;
  logo?: string;
  description?: string;
  university_type: string;
  student_count: number;
  professor_count: number;
  project_count: number;
}

export default function Partners() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/api/universities/list/`);

        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }

        const data = await response.json();
        setUniversities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <div style={{background: 'var(--background)'}}>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden hexagon-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <LazyLoad animationType="fade-up">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl"
                  style={{color: 'var(--secondary-charcoal)'}}>
                <span className="block">Our University</span>
                <span className="block" style={{color: 'var(--primary-orange)'}}>Partners</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl font-canva-sans"
                 style={{color: 'var(--secondary-taupe)'}}>
                Connecting student entrepreneurs across leading universities and institutions
              </p>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 md:py-20" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                   style={{borderColor: 'var(--primary-orange)'}}></div>
              <p className="mt-4 text-lg font-canva-sans"
                 style={{color: 'var(--secondary-taupe)'}}>
                Loading partner universities...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                   style={{backgroundColor: 'rgba(231, 159, 116, 0.2)'}}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{color: 'var(--secondary-red)'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-lg font-canva-sans"
                 style={{color: 'var(--secondary-red)'}}>
                {error}
              </p>
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-canva-sans"
                 style={{color: 'var(--secondary-taupe)'}}>
                No universities found. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {universities.map((university, index) => (
                <LazyLoad key={university.id} animationType="fade-up" delay={index * 50}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-orange-200 group p-8">
                    {/* University Logo */}
                    <div className="flex items-center justify-center mb-6">
                      {university.logo ? (
                        <img
                          src={university.logo}
                          alt={`${university.name} logo`}
                          className="w-24 h-24 object-contain"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                             style={{backgroundColor: 'var(--neutral-light-orange)'}}>
                          🎓
                        </div>
                      )}
                    </div>

                    {/* University Name */}
                    <h3 className="text-xl font-bold font-roca-two text-center mb-2 group-hover:scale-105 transition-transform duration-300"
                        style={{color: 'var(--secondary-charcoal)'}}>
                      {university.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center justify-center text-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0"
                           fill="none" stroke="currentColor" viewBox="0 0 24 24"
                           style={{color: 'var(--primary-orange)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-canva-sans"
                         style={{color: 'var(--secondary-taupe)'}}>
                        {university.city}, {university.state_province}, {university.country}
                      </p>
                    </div>
                  </div>
                </LazyLoad>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{backgroundColor: 'var(--secondary-charcoal)'}} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LazyLoad animationType="fade-up">
            <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl mb-4"
                style={{color: 'var(--primary-white)'}}>
              Is Your University Missing?
            </h2>
            <p className="text-xl font-canva-sans mb-8"
               style={{color: 'var(--primary-white)'}}>
              We&apos;re always looking to partner with more universities. Get in touch to add your institution!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold font-canva-sans rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: 'var(--primary-orange)',
                color: 'white'
              }}
            >
              Contact Us
            </Link>
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
