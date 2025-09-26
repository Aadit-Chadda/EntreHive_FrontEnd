import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function Services() {
  const services = [
    {
      title: "Project Collaboration",
      description: "Join or create projects with students from different disciplines. Build diverse teams and tackle real-world challenges together.",
      icon: "🤝",
      color: "var(--primary-orange)",
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
      color: "var(--accent-pine)",
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
      color: "var(--accent-terracotta)",
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
      color: "var(--accent-navy)",
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
      color: "var(--secondary-red)",
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
      color: "var(--primary-orange)",
      features: [
        "Professional networking events",
        "Alumni connections",
        "Industry partnerships",
        "Global university network"
      ]
    }
  ];

  return (
    <div style={{background: 'var(--background)'}}>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden hexagon-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white/95 backdrop-blur-sm sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            {/* Hexagonal separator */}
            <div className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-full">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="hexagon absolute animate-hexagon-float"
                    style={{
                      top: `${i * 15}%`,
                      right: `${-20 + (i % 2) * 10}px`,
                      animationDelay: `${i * 0.5}s`,
                      opacity: 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                {/* Services Badge */}
                <div className="mb-6 flex sm:justify-center lg:justify-start">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans" 
                       style={{background: 'var(--primary-orange)', color: 'white'}}>
                    <span className="font-roca-two">Our Services</span>
                  </div>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>Everything You Need</span>{' '}
                  <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>To Succeed</span>
                </h1>
                <p className="mt-3 text-base font-canva-sans sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up stagger-2"
                   style={{color: 'var(--secondary-taupe)'}}>
                  Everything you need to turn your entrepreneurial ideas into reality, 
                  all within your university ecosystem where innovation thrives.
                </p>
                
                {/* Service icons preview */}
                <div className="mt-8 flex sm:justify-center lg:justify-start space-x-6 animate-fade-in-up stagger-3">
                  <div className="flex flex-col items-center space-y-2 hover-lift">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-glow" style={{backgroundColor: 'var(--primary-orange)'}}>
                      <span className="text-2xl">🤝</span>
                    </div>
                    <span className="text-xs font-medium font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Collaborate</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.2s' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-glow" style={{ 
                      animationDelay: '0.5s',
                      backgroundColor: 'var(--accent-pine)'
                    }}>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <span className="text-xs font-medium font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Mentor</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.4s' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-glow" style={{ 
                      animationDelay: '1s',
                      backgroundColor: 'var(--accent-terracotta)'
                    }}>
                      <span className="text-2xl">💰</span>
                    </div>
                    <span className="text-xs font-medium font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Fund</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 hover-lift" style={{ animationDelay: '0.6s' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-glow" style={{ 
                      animationDelay: '1.5s',
                      backgroundColor: 'var(--accent-navy)'
                    }}>
                      <span className="text-2xl">🚀</span>
                    </div>
                    <span className="text-xs font-medium font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Launch</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative">
            <div className="absolute inset-0 transform rotate-3 animate-float opacity-10 gradient-hive"></div>
            <div className="relative gradient-hive h-full flex items-center justify-center overflow-hidden">
              
              {/* Hexagonal network */}
              <div className="absolute inset-0">
                {/* Hexagon connection lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="hexGradServices" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
                    </linearGradient>
                  </defs>
                  {/* Hexagonal network pattern */}
                  <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" stroke="url(#hexGradServices)" strokeWidth="2" fill="none" className="animate-pulse" />
                  <polygon points="200,100 250,125 250,175 200,200 150,175 150,125" stroke="url(#hexGradServices)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <polygon points="300,150 350,175 350,225 300,250 250,225 250,175" stroke="url(#hexGradServices)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </svg>
                
                {/* Floating hexagons */}
                <div className="absolute top-1/4 left-1/4 animate-hexagon-float" style={{ animationDelay: '0s' }}>
                  <div className="w-8 h-8 transform rotate-45" style={{backgroundColor: 'rgba(255,255,255,0.4)'}}></div>
                </div>
                <div className="absolute top-1/3 right-1/4 animate-hexagon-float" style={{ animationDelay: '1s' }}>
                  <div className="w-6 h-6 transform rotate-45" style={{backgroundColor: 'rgba(255,255,255,0.3)'}}></div>
                </div>
                <div className="absolute bottom-1/3 left-1/3 animate-hexagon-float" style={{ animationDelay: '2s' }}>
                  <div className="w-10 h-10 transform rotate-45" style={{backgroundColor: 'rgba(255,255,255,0.35)'}}></div>
                </div>
              </div>
              
              {/* Central services hub */}
              <div className="relative text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white/95 rounded-full flex items-center justify-center backdrop-blur-sm border-4 hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl animate-glow"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <div className="text-center">
                    <span className="text-4xl">⚙️</span>
                    <div className="text-xs font-bold font-roca-two mt-2" style={{color: 'var(--primary-orange)'}}>Services</div>
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 shadow-lg"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="text-lg font-semibold font-roca-two animate-fade-in-up" style={{color: 'var(--text-primary)'}}>Complete Ecosystem</p>
                  <div className="mt-3 flex justify-center space-x-2">
                    <div className="w-3 h-3 rounded-full animate-ping" style={{backgroundColor: 'var(--primary-orange)', animationDelay: '0.6s'}}></div>
                    <div className="w-3 h-3 rounded-full animate-ping" style={{backgroundColor: 'var(--accent-pine)', animationDelay: '0.8s'}}></div>
                    <div className="w-3 h-3 rounded-full animate-ping" style={{backgroundColor: 'var(--accent-terracotta)', animationDelay: '1.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Complete Suite
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Services That Empower
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                From collaboration to funding, our comprehensive services support every stage of your entrepreneurial journey.
              </p>
            </div>
          </LazyLoad>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <LazyLoad key={index} animationType="scale" delay={100 * (index + 1)}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover-lift group border-2 border-transparent hover:border-orange-200">
                  <div className="p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: service.color}}>
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold font-roca-two text-center mb-3 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>
                      {service.title}
                    </h3>
                    <p className="font-canva-sans text-center mb-6" style={{color: 'var(--secondary-taupe)'}}>
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-5 w-5 rounded-full text-white text-xs group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: service.color}}>
                              ✓
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>{feature}</span>
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                How It Works
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Your Journey on EntreHive
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                From idea to reality in four simple steps in the entrepreneurial hive
              </p>
            </div>
          </LazyLoad>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <LazyLoad animationType="fade-up" delay={100}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                  <span className="text-xl font-bold font-roca-two">1</span>
                </div>
                <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Sign Up</h3>
                <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Create your profile and tell us about your interests, skills, and entrepreneurial goals.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={200}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                  <span className="text-xl font-bold font-roca-two">2</span>
                </div>
                <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Connect</h3>
                <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Find like-minded peers, mentors, and potential collaborators within your university network.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={300}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-terracotta)'}}>
                  <span className="text-xl font-bold font-roca-two">3</span>
                </div>
                <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Collaborate</h3>
                <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Join projects, share resources, and work together to bring innovative ideas to life.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={400}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-navy)'}}>
                  <span className="text-xl font-bold font-roca-two">4</span>
                </div>
                <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Succeed</h3>
                <p className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Launch your venture with the support, skills, and network you&apos;ve built through EntreHive.
                </p>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Benefits
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Why Choose EntreHive?
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                Discover the advantages of joining our entrepreneurial ecosystem
              </p>
            </div>
          </LazyLoad>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <LazyLoad animationType="fade-left" delay={100}>
              <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:shadow-lg transition-all duration-300 group border-2 border-transparent hover:border-orange-200">
                <h3 className="text-2xl font-bold font-roca-two mb-6 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>For Students</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--primary-orange)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Gain real-world experience without leaving campus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--primary-orange)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Build a professional network before graduation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--primary-orange)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Access funding and mentorship opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--primary-orange)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Develop entrepreneurial skills alongside academic studies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--primary-orange)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Skip competitive internship applications</span>
                  </li>
                </ul>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-right" delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8 hover-lift hover:shadow-lg transition-all duration-300 group border-2 border-transparent hover:border-orange-200">
                <h3 className="text-2xl font-bold font-roca-two mb-6 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>For Faculty</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-pine)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Share expertise and mentor the next generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-pine)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Discover and invest in promising student ventures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-pine)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Stay connected with emerging trends and technologies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-pine)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Collaborate on cutting-edge research projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-pine)'}}>✅</span>
                    <span className="font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>Build industry partnerships through student connections</span>
                  </li>
                </ul>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Success Stories
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Real Results from Real Students
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                See how our services help turn entrepreneurial dreams into successful ventures
              </p>
            </div>
          </LazyLoad>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <LazyLoad animationType="scale" delay={100}>
              <div className="rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group border-2" style={{
                backgroundColor: 'var(--neutral-light-orange)',
                borderColor: 'var(--primary-orange)'
              }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>EcoTrack App</h3>
                  <p className="font-canva-sans text-sm mb-4" style={{color: 'var(--secondary-taupe)'}}>
                    Students from CS and Environmental Science collaborated to create a carbon footprint tracking app, 
                    securing $50K in university funding.
                  </p>
                  <div className="text-xs font-medium font-canva-sans" style={{color: 'var(--primary-orange)'}}>MIT • 6 months to launch</div>
                </div>
              </div>
            </LazyLoad>

            <LazyLoad animationType="scale" delay={200}>
              <div className="rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group border-2" style={{
                backgroundColor: 'rgba(33, 79, 56, 0.1)',
                borderColor: 'var(--accent-pine)'
              }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                    <span className="text-white text-2xl">🏥</span>
                  </div>
                  <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>MedAssist</h3>
                  <p className="font-canva-sans text-sm mb-4" style={{color: 'var(--secondary-taupe)'}}>
                    Pre-med and engineering students developed a patient monitoring system, 
                    now being tested in the university hospital.
                  </p>
                  <div className="text-xs font-medium font-canva-sans" style={{color: 'var(--accent-pine)'}}>Stanford • 8 months to pilot</div>
                </div>
              </div>
            </LazyLoad>

            <LazyLoad animationType="scale" delay={300}>
              <div className="rounded-lg p-6 hover-lift hover:shadow-lg transition-all duration-300 group border-2" style={{
                backgroundColor: 'rgba(231, 159, 116, 0.1)',
                borderColor: 'var(--accent-terracotta)'
              }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-terracotta)'}}>
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-bold font-roca-two mb-2 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>StudyBuddy</h3>
                  <p className="font-canva-sans text-sm mb-4" style={{color: 'var(--secondary-taupe)'}}>
                    A peer tutoring platform that connected over 2,000 students, 
                    founded by a sophomore with faculty mentorship.
                  </p>
                  <div className="text-xs font-medium font-canva-sans" style={{color: 'var(--accent-terracotta)'}}>Harvard • 4 months to scale</div>
                </div>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hive py-16">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="mb-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full border-2 font-semibold font-canva-sans" style={{
                borderColor: 'var(--primary-orange)',
                color: 'var(--primary-orange)'
              }}>
                <span>Start Your Journey</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl"
                style={{color: 'var(--primary-white)'}}>
              <span className="block">Ready to start building?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 font-canva-sans"
               style={{color: 'var(--primary-white)'}}>
              Join EntreHive today and access all the tools, connections, and resources you need to succeed.
            </p>
          </LazyLoad>
          <LazyLoad animationType="scale" delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  color: 'white'
                }}
              >
                <span>Get Started Now</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl border-2 hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: 'var(--primary-orange)',
                  color: 'var(--primary-orange)',
                  backgroundColor: 'transparent'
                }}
              >
                <span>Learn More</span>
              </Link>
            </div>
          </LazyLoad>
        </div>
      </section>
    </div>
  );
}
