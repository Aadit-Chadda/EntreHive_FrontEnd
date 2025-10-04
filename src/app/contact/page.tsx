'use client';

import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string[]}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          inquiry_type: formData.inquiryType,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setErrors({});
        // Reset form
        setFormData({
          name: '',
          email: '',
          inquiryType: 'general',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        // Store specific field errors from the API
        if (data.errors) {
          setErrors(data.errors);
        }
        console.error('Error submitting form:', data.errors || data);
        // Reset error message after 10 seconds
        setTimeout(() => {
          setStatus('idle');
          setErrors({});
        }, 10000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrors({});
      // Reset error message after 10 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrors({});
      }, 10000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{background: 'var(--background)'}}>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden hexagon-pattern">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans" 
                   style={{background: 'var(--primary-orange)', color: 'white'}}>
                <span className="font-roca-two">Get in Touch</span>
              </div>
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>Contact</span>{' '}
              <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>Us</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base font-canva-sans sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-up stagger-2"
               style={{color: 'var(--secondary-taupe)'}}>
              Have questions? We&apos;re here to help! Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Contact Methods */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
            <LazyLoad animationType="fade-up" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover-lift border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4" style={{backgroundColor: 'var(--primary-orange)'}}>
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  Email Us
                </h3>
                <p className="font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  Send us an email anytime
                </p>
                <a 
                  href="mailto:support@entrehive.app" 
                  className="font-canva-sans font-semibold hover:underline"
                  style={{color: 'var(--primary-orange)'}}
                >
                  support@entrehive.app
                </a>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover-lift border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4" style={{backgroundColor: 'var(--accent-pine)'}}>
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  Response Time
                </h3>
                <p className="font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  We typically respond within
                </p>
                <p className="font-canva-sans font-semibold" style={{color: 'var(--accent-pine)'}}>
                  24-48 hours
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={300}>
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover-lift border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4" style={{backgroundColor: 'var(--accent-terracotta)'}}>
                  <span className="text-2xl">🕒</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                  Support Hours
                </h3>
                <p className="font-canva-sans mb-4" style={{color: 'var(--secondary-taupe)'}}>
                  Monday - Friday
                </p>
                <p className="font-canva-sans font-semibold" style={{color: 'var(--accent-terracotta)'}}>
                  9:00 AM - 6:00 PM EST
                </p>
              </div>
            </LazyLoad>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <LazyLoad animationType="fade-up">
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                    Send Us a Message
                  </h2>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Fill out the form below and we&apos;ll get back to you shortly
                  </p>
                </div>

                {status === 'success' && (
                  <div className="mb-6 p-4 rounded-lg border-2" style={{
                    backgroundColor: 'rgba(33, 79, 56, 0.1)',
                    borderColor: 'var(--accent-pine)'
                  }}>
                    <p className="font-canva-sans text-center font-semibold" style={{color: 'var(--accent-pine)'}}>
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="mb-6 p-4 rounded-lg border-2" style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderColor: '#dc3545'
                  }}>
                    <p className="font-canva-sans text-center font-semibold mb-2" style={{color: '#dc3545'}}>
                      ✗ Please fix the following errors:
                    </p>
                    {Object.keys(errors).length > 0 ? (
                      <ul className="list-disc list-inside text-left space-y-1">
                        {Object.entries(errors).map(([field, messages]) => (
                          messages.map((message, idx) => (
                            <li key={`${field}-${idx}`} className="font-canva-sans text-sm" style={{color: '#dc3545'}}>
                              <strong className="capitalize">{field === 'inquiry_type' ? 'Type of Inquiry' : field}:</strong> {message}
                            </li>
                          ))
                        ))}
                      </ul>
                    ) : (
                      <p className="font-canva-sans text-center text-sm" style={{color: '#dc3545'}}>
                        Failed to send message. Please try again or email us directly at support@entrehive.app
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-400 transition-colors font-canva-sans ${errors.name ? 'border-red-500' : ''}`}
                      style={{borderColor: errors.name ? '#dc3545' : 'var(--border)'}}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm font-canva-sans" style={{color: '#dc3545'}}>
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-400 transition-colors font-canva-sans ${errors.email ? 'border-red-500' : ''}`}
                      style={{borderColor: errors.email ? '#dc3545' : 'var(--border)'}}
                      placeholder="john@university.edu"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm font-canva-sans" style={{color: '#dc3545'}}>
                        {errors.email[0]}
                      </p>
                    )}
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Type of Inquiry *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-400 transition-colors font-canva-sans"
                      style={{borderColor: 'var(--border)'}}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="university">University Partnership</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="investor">Investor Relations</option>
                      <option value="press">Press & Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Subject * (minimum 5 characters)
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      minLength={5}
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-400 transition-colors font-canva-sans ${errors.subject ? 'border-red-500' : ''}`}
                      style={{borderColor: errors.subject ? '#dc3545' : 'var(--border)'}}
                      placeholder="Brief description of your inquiry (at least 5 characters)"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm font-canva-sans" style={{color: '#dc3545'}}>
                        {errors.subject[0]}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold font-canva-sans mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                      Message * (minimum 10 characters)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={10}
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-400 transition-colors font-canva-sans resize-none ${errors.message ? 'border-red-500' : ''}`}
                      style={{borderColor: errors.message ? '#dc3545' : 'var(--border)'}}
                      placeholder="Please provide details about your inquiry (at least 10 characters)..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm font-canva-sans" style={{color: '#dc3545'}}>
                        {errors.message[0]}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--primary-orange)',
                        color: 'white'
                      }}
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </LazyLoad>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <LazyLoad animationType="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-roca-two mb-4" style={{color: 'var(--secondary-charcoal)'}}>
                  Frequently Asked Questions
                </h2>
                <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Quick answers to common questions
                </p>
              </div>
            </LazyLoad>

            <div className="space-y-6">
              <LazyLoad animationType="fade-up" delay={100}>
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <h3 className="text-lg font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    How do I get started on EntreHive?
                  </h3>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Simply sign up with your university email address, complete your profile, and start exploring 
                    projects, connecting with other students and faculty, and building your entrepreneurial network.
                  </p>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-up" delay={200}>
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <h3 className="text-lg font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Is EntreHive available for my university?
                  </h3>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    We&apos;re continuously expanding to new universities. Contact us with your university information 
                    and we&apos;ll let you know about availability or help facilitate a partnership.
                  </p>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-up" delay={300}>
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <h3 className="text-lg font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    How can my university partner with EntreHive?
                  </h3>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    We offer institutional partnerships for universities interested in fostering entrepreneurial 
                    ecosystems. Please select &quot;University Partnership&quot; in the inquiry type above to learn more.
                  </p>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-up" delay={400}>
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <h3 className="text-lg font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    I&apos;m having technical issues. What should I do?
                  </h3>
                  <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Select &quot;Technical Support&quot; in the inquiry type above and provide details about the issue 
                    you&apos;re experiencing. Our technical team will assist you promptly.
                  </p>
                </div>
              </LazyLoad>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hive py-16">
        <div className="max-w-2xl mx-auto text-center py-8 px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl mb-4"
                style={{color: 'var(--primary-white)'}}>
              Ready to Join the Hive?
            </h2>
            <p className="text-lg leading-6 font-canva-sans mb-8"
               style={{color: 'var(--primary-white)'}}>
              Start building the future with fellow university innovators today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-orange)'
              }}
            >
              Get Started Now
            </Link>
          </LazyLoad>
        </div>
      </section>
    </div>
  );
}

