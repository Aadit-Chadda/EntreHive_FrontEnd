import Link from 'next/link';
import LazyLoad from '../components/LazyLoad';

export default function About() {
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
                {/* About Badge */}
                <div className="mb-6 flex sm:justify-center lg:justify-start">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans" 
                       style={{background: 'var(--primary-orange)', color: 'white'}}>
                    <span className="font-roca-two">Our Story</span>
                  </div>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>About</span>{' '}
                  <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>EntreHive</span>
                </h1>
                <p className="mt-3 text-base font-canva-sans sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up stagger-2"
                   style={{color: 'var(--secondary-taupe)'}}>
                  Bridging the gap between student entrepreneurs, investors, and service providers 
                  through collaborative university ecosystems where innovation thrives.
                </p>
                
                {/* Interactive elements */}
                <div className="mt-8 flex sm:justify-center lg:justify-start space-x-4 animate-fade-in-up stagger-3">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-full hover-lift border-2"
                       style={{
                         backgroundColor: 'var(--neutral-light-orange)',
                         borderColor: 'var(--primary-orange)',
                         color: 'var(--primary-orange)'
                       }}>
                    <span className="text-2xl">🎓</span>
                    <span className="text-sm font-medium font-canva-sans">Students</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-full hover-lift border-2"
                       style={{ 
                         animationDelay: '0.2s',
                         backgroundColor: 'rgba(33, 79, 56, 0.1)',
                         borderColor: 'var(--accent-pine)',
                         color: 'var(--accent-pine)'
                       }}>
                    <span className="text-2xl">👨‍🏫</span>
                    <span className="text-sm font-medium font-canva-sans">Faculty</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-full hover-lift border-2"
                       style={{ 
                         animationDelay: '0.4s',
                         backgroundColor: 'rgba(231, 159, 116, 0.1)',
                         borderColor: 'var(--accent-terracotta)',
                         color: 'var(--accent-terracotta)'
                       }}>
                    <span className="text-2xl">🤝</span>
                    <span className="text-sm font-medium font-canva-sans">Together</span>
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
                    <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
                    </linearGradient>
                  </defs>
                  {/* Hexagonal network pattern */}
                  <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" stroke="url(#hexGrad)" strokeWidth="2" fill="none" className="animate-pulse" />
                  <polygon points="200,100 250,125 250,175 200,200 150,175 150,125" stroke="url(#hexGrad)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <polygon points="300,150 350,175 350,225 300,250 250,225 250,175" stroke="url(#hexGrad)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
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
              
              {/* Central about hub */}
              <div className="relative text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white/95 rounded-full flex items-center justify-center backdrop-blur-sm border-4 hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl animate-glow"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <div className="text-center">
                    <span className="text-4xl">🏛️</span>
                    <div className="text-xs font-bold font-roca-two mt-2" style={{color: 'var(--primary-orange)'}}>Our Story</div>
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 shadow-lg"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="text-lg font-semibold font-roca-two animate-fade-in-up" style={{color: 'var(--text-primary)'}}>Building Bridges</p>
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

      {/* Mission Section */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Our Mission
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Fostering Entrepreneurial Growth
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans lg:mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                Our mission is to create a collaborative ecosystem that fosters entrepreneurial growth 
                by providing access to resources, funding, and expertise within university communities.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center px-6 py-3 rounded-full border-2 font-semibold font-canva-sans"
                     style={{
                       borderColor: 'var(--primary-orange)',
                       color: 'var(--primary-orange)',
                       backgroundColor: 'var(--neutral-light-orange)'
                     }}>
                  <span className="text-lg mr-2">🌱</span>
                  <span>Growing Innovation Together</span>
                </div>
              </div>
            </div>
          </LazyLoad>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              <LazyLoad animationType="fade-left" delay={100}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--primary-orange)'}}>
                      <span className="text-2xl">🎓</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>University-Focused</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Built specifically for university environments, understanding the unique needs 
                    of students and faculty in the entrepreneurial journey.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={200}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--accent-pine)'}}>
                      <span className="text-2xl">🤝</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Peer-to-Peer</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Direct connections between students, removing traditional barriers and hierarchies 
                    to enable authentic collaboration and learning.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-left" delay={300}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--accent-terracotta)'}}>
                      <span className="text-2xl">🚀</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Innovation-Driven</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Focused on turning ideas into reality through practical experience, real-world 
                    applications, and hands-on entrepreneurial learning.
                  </dd>
                </div>
              </LazyLoad>
            </div>
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
                Built Around Two Core University Groups
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                Students and Professors/Faculty working together without hierarchy in the entrepreneurial hive.
              </p>
            </div>
          </LazyLoad>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Students Side */}
              <LazyLoad animationType="fade-left" delay={100}>
                <div className="rounded-lg p-8 hover-lift hover:shadow-lg transition-all duration-300 group border-2" style={{
                  backgroundColor: 'var(--neutral-light-orange)',
                  borderColor: 'var(--primary-orange)'
                }}>
                  <h3 className="text-2xl font-bold font-roca-two mb-6 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>👨‍🎓 Students</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Real-World Skill Building:</strong> Craft real pitch decks, run marketing campaigns, 
                        and manage projects with actual deadlines and stakeholders.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Peer Collaboration:</strong> Join plug-and-play teams and connect with students 
                        from different disciplines for diverse perspectives.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Alternative to Internships:</strong> Gain hands-on experience without formal applications 
                        or competitive job listings.
                      </p>
                    </div>
                  </div>
                </div>
              </LazyLoad>

              {/* Faculty Side */}
              <LazyLoad animationType="fade-right" delay={200}>
                <div className="rounded-lg p-8 hover-lift hover:shadow-lg transition-all duration-300 group border-2" style={{
                  backgroundColor: 'rgba(33, 79, 56, 0.1)',
                  borderColor: 'var(--accent-pine)'
                }}>
                  <h3 className="text-2xl font-bold font-roca-two mb-6 group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>👩‍🏫 Professors/Faculty</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Share Expertise:</strong> Provide mentorship and guidance based on years of 
                        academic and industry experience.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Invest & Support:</strong> Contribute resources, funding, or services to 
                        promising student ventures.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                          ✓
                        </div>
                      </div>
                      <p className="ml-3 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                        <strong style={{color: 'var(--secondary-charcoal)'}}>Learn & Innovate:</strong> Stay connected with emerging trends and collaborate 
                        on cutting-edge projects.
                      </p>
                    </div>
                  </div>
                </div>
              </LazyLoad>
            </div>
          </div>
        </div>
      </section>

      {/* No Hierarchy Section */}
      <section className="relative py-24 gradient-hive overflow-hidden">
        {/* Hexagonal background pattern */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="hexagon absolute animate-hexagon-float"
              style={{
                top: `${10 + (i % 3) * 30}%`,
                left: `${5 + (i % 4) * 25}%`,
                animationDelay: `${i * 0.7}s`,
                opacity: 0.1,
                transform: `scale(${0.8 + (i % 3) * 0.4})`
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-roca-two text-white mb-6">
              Here&apos;s the Catch — <span style={{color: 'var(--primary-orange)'}}>No Hierarchy</span>
            </h2>
            <p className="text-xl font-canva-sans text-white max-w-4xl mx-auto leading-relaxed opacity-90">
              Your role isn&apos;t limited by your title. Whether you&apos;re a student, professor, or faculty member — 
              you can be an entrepreneur, an investor, a mentor, or someone offering services.
            </p>
          </div>

          {/* Central Message */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 animate-glow border-4"
                 style={{
                   backgroundColor: 'var(--primary-orange)',
                   borderColor: 'white'
                 }}>
              <span className="text-4xl">💡</span>
            </div>
            <h3 className="text-3xl font-bold font-roca-two text-white mb-6">
              What matters is your{' '}
              <span className="relative">
                <span style={{color: 'var(--primary-orange)'}}>idea</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 rounded" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              </span>
              , your{' '}
              <span className="relative">
                <span style={{color: 'var(--primary-orange)'}}>interest</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 rounded" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              </span>
              , or your{' '}
              <span className="relative">
                <span style={{color: 'var(--primary-orange)'}}>expertise</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 rounded" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              </span>
            </h3>
            <p className="text-2xl font-bold font-canva-sans text-white">
              — not your position at the university.
            </p>
          </div>

          {/* Interactive Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Students Card */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300 opacity-50 hexagon" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              <div className="relative bg-white rounded-2xl p-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                    <span className="text-3xl">🎓</span>
                  </div>
                  <h4 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>Students</h4>
                  <p className="font-semibold font-canva-sans mb-4" style={{color: 'var(--primary-orange)'}}>Create & Lead</p>
                  <div className="space-y-2 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-orange)'}}></span>
                      Innovate fearlessly
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-orange)'}}></span>
                      Build networks
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--primary-orange)'}}></span>
                      Shape the future
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Card */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl transform -rotate-6 group-hover:-rotate-3 transition-transform duration-300 opacity-50 hexagon" style={{backgroundColor: 'var(--accent-pine)'}}></div>
              <div className="relative bg-white rounded-2xl p-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                    <span className="text-3xl">👨‍🏫</span>
                  </div>
                  <h4 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>Faculty</h4>
                  <p className="font-semibold font-canva-sans mb-4" style={{color: 'var(--accent-pine)'}}>Mentor & Invest</p>
                  <div className="space-y-2 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-pine)'}}></span>
                      Share wisdom
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-pine)'}}></span>
                      Fund innovation
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-pine)'}}></span>
                      Guide success
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Together Card */}
            <div className="group relative md:col-span-1">
              <div className="absolute inset-0 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-300 opacity-50 hexagon" style={{backgroundColor: 'var(--accent-terracotta)'}}></div>
              <div className="relative bg-white rounded-2xl p-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-terracotta)'}}>
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h4 className="text-xl font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>Together</h4>
                  <p className="font-semibold font-canva-sans mb-4" style={{color: 'var(--accent-terracotta)'}}>Build the Future</p>
                  <div className="space-y-2 text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-terracotta)'}}></span>
                      Equal partners
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-terracotta)'}}></span>
                      Shared goals
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: 'var(--accent-terracotta)'}}></span>
                      Unlimited potential
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-8 py-4 border-2" style={{borderColor: 'var(--primary-orange)'}}>
              <span className="text-2xl">🌟</span>
              <span className="text-white font-medium font-canva-sans">Ideas over titles. Impact over hierarchy.</span>
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Our Vision
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                The Future of University Innovation
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans lg:mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                We envision universities as thriving entrepreneurial ecosystems where every student has the 
                opportunity to turn their ideas into reality, backed by a supportive community of peers and mentors.
              </p>
            </div>
          </LazyLoad>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <LazyLoad animationType="fade-up" delay={100}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Nurture Ideas</h3>
                <p className="mt-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Provide the soil for innovative ideas to grow and flourish in university environments.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={200}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-pine)'}}>
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Connect Minds</h3>
                <p className="mt-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Bridge gaps between different disciplines, backgrounds, and expertise levels.
                </p>
              </div>
            </LazyLoad>

            <LazyLoad animationType="fade-up" delay={300}>
              <div className="text-center group hover-lift">
                <div className="flex items-center justify-center h-16 w-16 rounded-full text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--accent-terracotta)'}}>
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold font-roca-two group-hover:scale-105 transition-all duration-300" style={{color: 'var(--secondary-charcoal)'}}>Drive Impact</h3>
                <p className="mt-2 font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                  Create meaningful change through student-driven innovation and entrepreneurship.
                </p>
              </div>
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{backgroundColor: 'var(--secondary-charcoal)'}}>
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="mb-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full border-2 font-semibold font-canva-sans" style={{
                borderColor: 'var(--primary-orange)',
                color: 'var(--primary-orange)'
              }}>
                <span>Join the Hive Movement</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl"
                style={{color: 'var(--primary-white)'}}>
              <span className="block">Ready to be part of the movement?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 font-canva-sans"
               style={{color: 'var(--primary-white)'}}>
              Join EntreHive today and start building the future with fellow university innovators.
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
                <span>Join the Hive</span>
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl border-2 hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: 'var(--primary-orange)',
                  color: 'var(--primary-orange)',
                  backgroundColor: 'transparent'
                }}
              >
                <span>Explore the Hive</span>
              </Link>
            </div>
          </LazyLoad>
        </div>
      </section>
    </div>
  );
}
