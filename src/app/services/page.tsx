import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function Services() {
  const services = [
    {
      title: "Project Collaboration",
      description: "Join or create projects with students from different disciplines. Build diverse teams and tackle real-world challenges together.",
      icon: "🤝",
      features: [
        "Cross-disciplinary team matching",
        "Project management tools",
        "Real-time collaboration spaces",
        "Skill-based team recommendations"
      ]
    },
    {
      title: "Mentorship Network",
      description: "Connect with experienced faculty, alumni, and industry professionals who can guide your entrepreneurial journey.",
      icon: "🎯",
      features: [
        "1-on-1 mentorship matching",
        "Group mentoring sessions",
        "Industry expert connections",
        "Progress tracking and feedback"
      ]
    },
    {
      title: "Funding Opportunities",
      description: "Access funding from university grants, faculty investors, and peer-to-peer investment networks within your institution.",
      icon: "💰",
      features: [
        "University grant database",
        "Peer investment pools",
        "Faculty angel networks",
        "Pitch deck development tools"
      ]
    },
    {
      title: "Skill Development",
      description: "Build real-world skills through hands-on projects, workshops, and practical experience with startup environments.",
      icon: "📚",
      features: [
        "Interactive workshops",
        "Real project experience",
        "Skill assessment tools",
        "Certification programs"
      ]
    },
    {
      title: "Resource Sharing",
      description: "Access university resources, tools, and services needed to bring your entrepreneurial ideas to life.",
      icon: "🛠️",
      features: [
        "University facility access",
        "Software and tool licenses",
        "Equipment sharing",
        "Legal and business support"
      ]
    },
    {
      title: "Network Building",
      description: "Build lasting professional relationships with fellow entrepreneurs, investors, and service providers.",
      icon: "🌐",
      features: [
        "Professional networking events",
        "Alumni connections",
        "Industry partnerships",
        "Global university network"
      ]
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden">
        {/* Animated background bubbles */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-yellow-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-32 left-1/2 w-8 h-8 bg-red-500 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-60 left-16 w-10 h-10 bg-pink-500 rounded-full animate-float" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute top-60 right-1/4 w-6 h-6 bg-indigo-500 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="gradient-text">Our Services</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Everything you need to turn your entrepreneurial ideas into reality, 
              all within your university ecosystem.
            </p>
            
            {/* Service icons preview */}
            <div className="mt-8 flex justify-center space-x-6">
              <div className="flex flex-col items-center space-y-2 hover-lift">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-glow">
                  <span className="text-2xl">🤝</span>
                </div>
                <span className="text-xs font-medium text-gray-600">Collaborate</span>
              </div>
              <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center animate-glow" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-xs font-medium text-gray-600">Mentor</span>
              </div>
              <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center animate-glow" style={{ animationDelay: '1s' }}>
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-xs font-medium text-gray-600">Fund</span>
              </div>
              <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.6s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-glow" style={{ animationDelay: '1.5s' }}>
                  <span className="text-2xl">🚀</span>
                </div>
                <span className="text-xs font-medium text-gray-600">Launch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <LazyLoad key={index} animationType="scale" delay={100 * (index + 1)}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover-lift group">
                  <div className="p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white text-xs group-hover:scale-110 transition-transform duration-300">
                              ✓
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </LazyLoad>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Journey on EntreHive
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              From idea to reality in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <LazyLoad animationType="fade-up" delay={100}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Sign Up</h3>
                <p className="text-gray-600">
                  Create your profile and tell us about your interests, skills, and entrepreneurial goals.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={200}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Connect</h3>
                <p className="text-gray-600">
                  Find like-minded peers, mentors, and potential collaborators within your university network.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={300}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">Collaborate</h3>
                <p className="text-gray-600">
                  Join projects, share resources, and work together to bring innovative ideas to life.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={400}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">Succeed</h3>
                <p className="text-gray-600">
                  Launch your venture with the support, skills, and network you&apos;ve built through EntreHive.
                </p>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose EntreHive?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <LazyLoad animationType="fade-left" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:shadow-lg transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-300">For Students</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Gain real-world experience without leaving campus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Build a professional network before graduation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Access funding and mentorship opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Develop entrepreneurial skills alongside academic studies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Skip competitive internship applications</span>
                  </li>
                </ul>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-right" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:shadow-lg transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">For Faculty</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Share expertise and mentor the next generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Discover and invest in promising student ventures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Stay connected with emerging trends and technologies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Collaborate on cutting-edge research projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 text-xl mr-3 group-hover:scale-110 transition-transform duration-300">✅</span>
                    <span className="text-gray-700">Build industry partnerships through student connections</span>
                  </li>
                </ul>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Success Stories</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Real Results from Real Students
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <LazyLoad animationType="scale" delay={100}>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">EcoTrack App</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Students from CS and Environmental Science collaborated to create a carbon footprint tracking app, 
                    securing $50K in university funding.
                  </p>
                  <div className="text-xs text-blue-600 font-medium">MIT • 6 months to launch</div>
                </div>
              </div>
            </LazyLoad>

            <LazyLoad animationType="scale" delay={200}>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">🏥</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">MedAssist</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Pre-med and engineering students developed a patient monitoring system, 
                    now being tested in the university hospital.
                  </p>
                  <div className="text-xs text-green-600 font-medium">Stanford • 8 months to pilot</div>
                </div>
              </div>
            </LazyLoad>

            <LazyLoad animationType="scale" delay={300}>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">StudyBuddy</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    A peer tutoring platform that connected over 2,000 students, 
                    founded by a sophomore with faculty mentorship.
                  </p>
                  <div className="text-xs text-purple-600 font-medium">Harvard • 4 months to scale</div>
                </div>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start building?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join EntreHive today and access all the tools, connections, and resources you need to succeed.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 sm:w-auto transition-colors duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
