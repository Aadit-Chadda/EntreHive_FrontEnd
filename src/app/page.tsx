import Link from 'next/link';
import LazyLoad from './components/LazyLoad';
import CookieConsent from './components/CookieConsent';

export default function Home() {
  return (
    <div style={{background: '#F5F5F5', minHeight: '100vh'}}>
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
                {/* Entrepreneurial Badge */}
                <div className="mb-6 flex sm:justify-center lg:justify-start">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans"
                       style={{background: '#F3AC3B', color: 'white'}}>
                    <span className="font-roca-two">Bee Entrepreneurial</span>
                  </div>
                </div>

                <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline" style={{color: '#36454F'}}>Where Students</span>{' '}
                  <span className="block xl:inline" style={{color: '#F3AC3B'}}>Build the Future</span>
                </h1>
                <p className="mt-3 text-base font-canva-sans sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up stagger-2"
                   style={{color: '#8a6b53'}}>
                  A hive for entrepreneurs to connect. Our peer-to-peer platform brings together student entrepreneurs,
                  investors, and service providers to turn ideas into reality through real-world experience and university collaboration.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in-up stagger-3">
                  <div className="rounded-md shadow transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/feed"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium font-canva-sans rounded-md text-white hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                      style={{background: '#214F38'}}
                    >
                      Enter the Hive
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium font-canva-sans rounded-md hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                      style={{
                        color: '#F3AC3B',
                        backgroundColor: '#fdeedb',
                        borderColor: '#F3AC3B'
                      }}
                    >
                      Join the Hive
                    </Link>
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
              
              {/* Central hive hub */}
              <div className="relative text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white/95 rounded-full flex items-center justify-center backdrop-blur-sm border-4 hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl animate-glow"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <div className="text-center">
                    <img 
                      src="/Logoblacktransparent.png" 
                      alt="EntreHive Logo" 
                      className="w-20 h-20 object-contain animate-bee-hover"
                    />
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 shadow-lg"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="text-lg font-semibold font-roca-two animate-fade-in-up" style={{color: 'black'}}>The Entrepreneurial Hive</p>
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

      {/* Who We Are Section */}
      <section className="py-16 md:py-20 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Who We Are
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                A Hive for Entrepreneurs to Connect
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans lg:mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                EntreHive is where peer-to-peer learning and connections thrive. No hierarchy. No barriers. 
                Just pure collaboration between university minds ready to change the world through entrepreneurship.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center px-6 py-3 rounded-full border-2 font-semibold font-canva-sans"
                     style={{
                       borderColor: 'var(--primary-orange)',
                       color: 'var(--primary-orange)',
                       backgroundColor: 'var(--neutral-light-orange)'
                     }}>
                  <span className="text-lg mr-4">🤝</span>
                  <span>Peer-to-Peer Connection Platform</span>
                </div>
              </div>
            </div>
          </LazyLoad>

          <div className="mt-20">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-16 lg:gap-x-20 lg:gap-y-20">
              <LazyLoad animationType="fade-left" delay={100}>
                <div className="relative group hover-lift pt-10 pb-8 px-8 pl-12 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 rounded-xl text-white group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'var(--primary-orange)'}}>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <p className="text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Real-World Skill Building</p>
                  </dt>
                  <dd className="mt-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Craft real pitch decks, run marketing campaigns, and get feedback from industry professionals. 
                    Learn by doing, not just reading - the hive way.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={200}>
                <div className="relative group hover-lift pt-10 pb-8 px-8 pl-12 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 rounded-xl text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--accent-pine)'}}>
                      <span className="text-2xl">🤝</span>
                    </div>
                    <p className="text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Peer-to-Peer Collaboration</p>
                  </dt>
                  <dd className="mt-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Join plug-and-play teams, connect across disciplines, and build lasting partnerships 
                    with like-minded innovators in the entrepreneurial ecosystem.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-left" delay={300}>
                <div className="relative group hover-lift pt-10 pb-8 px-8 pl-12 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 rounded-xl text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--accent-terracotta)'}}>
                      <span className="text-2xl">💼</span>
                    </div>
                    <p className="text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Alternative to Internships</p>
                  </dt>
                  <dd className="mt-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Skip the competitive internship hunt. Gain hands-on experience with early-stage startups 
                    and real business challenges in our collaborative hive.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={400}>
                <div className="relative group hover-lift pt-10 pb-8 px-8 pl-12 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 rounded-xl text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--secondary-red)'}}>
                      <span className="text-2xl">🌟</span>
                    </div>
                    <p className="text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>No Hierarchy, Pure Collaboration</p>
                  </dt>
                  <dd className="mt-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Whether you&apos;re a student or professor, entrepreneur or investor - your ideas matter. 
                    In our hive, expertise trumps titles every time.
                  </dd>
                </div>
              </LazyLoad>
            </div>
          </div>
        </div>
      </section>

      {/* How EntreHive Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                How It Works
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Your Journey in the EntreHive Ecosystem
              </p>
              <p className="mt-4 max-w-3xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                From discovery to funding - here&apos;s how EntreHive connects student entrepreneurs with the resources, 
                partners, and opportunities they need to succeed
              </p>
            </div>
          </LazyLoad>

          {/* Workflow Steps */}
          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" 
                 style={{top: '50%', transform: 'translateY(-50%)'}}></div>
            
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 relative">
              {/* Step 1: University Feed */}
              <LazyLoad animationType="fade-up" delay={100}>
                <div className="relative group">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-orange-200 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl font-roca-two shadow-lg"
                         style={{background: 'var(--primary-orange)'}}>
                      1
                    </div>
                    
                    {/* Icon */}
                    <div className="mt-4 mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                           style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--accent-terracotta) 100%)'}}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold font-roca-two text-center mb-3"
                        style={{color: 'var(--secondary-charcoal)'}}>
                      Discover Your Feed
                    </h3>
                    <p className="text-center font-canva-sans text-sm leading-relaxed"
                       style={{color: 'var(--secondary-taupe)'}}>
                      Access your <span className="font-semibold" style={{color: 'var(--primary-orange)'}}>university-specific feed</span> or explore the <span className="font-semibold" style={{color: 'var(--primary-orange)'}}>public feed</span> to see what entrepreneurs across campuses are creating, sharing, and building.
                    </p>
                  </div>
                </div>
              </LazyLoad>

              {/* Step 2: Project Discovery */}
              <LazyLoad animationType="fade-up" delay={200}>
                <div className="relative group">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-200 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl font-roca-two shadow-lg"
                         style={{background: 'var(--accent-pine)'}}>
                      2
                    </div>
                    
                    {/* Icon */}
                    <div className="mt-4 mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                           style={{background: 'linear-gradient(135deg, var(--accent-pine) 0%, var(--primary-orange) 100%)'}}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold font-roca-two text-center mb-3"
                        style={{color: 'var(--secondary-charcoal)'}}>
                      Explore Projects
                    </h3>
                    <p className="text-center font-canva-sans text-sm leading-relaxed"
                       style={{color: 'var(--secondary-taupe)'}}>
                      Browse innovative <span className="font-semibold" style={{color: 'var(--accent-pine)'}}>student-led projects</span>, discover opportunities to collaborate, join teams, or find the perfect co-founder for your next big idea.
                    </p>
                  </div>
                </div>
              </LazyLoad>

              {/* Step 3: Create Posts & Build Traction */}
              <LazyLoad animationType="fade-up" delay={300}>
                <div className="relative group">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-amber-200 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl font-roca-two shadow-lg"
                         style={{background: 'var(--accent-terracotta)'}}>
                      3
                    </div>
                    
                    {/* Icon */}
                    <div className="mt-4 mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                           style={{background: 'linear-gradient(135deg, var(--accent-terracotta) 0%, var(--primary-orange) 100%)'}}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold font-roca-two text-center mb-3"
                        style={{color: 'var(--secondary-charcoal)'}}>
                      Build Traction
                    </h3>
                    <p className="text-center font-canva-sans text-sm leading-relaxed"
                       style={{color: 'var(--secondary-taupe)'}}>
                      Share updates, milestones, and achievements through <span className="font-semibold" style={{color: 'var(--accent-terracotta)'}}>posts</span>. Engage your community, gather feedback, and create buzz around your venture to attract attention.
                    </p>
                  </div>
                </div>
              </LazyLoad>

              {/* Step 4: Connect with Investors & Professors */}
              <LazyLoad animationType="fade-up" delay={400}>
                <div className="relative group">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-purple-200 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl font-roca-two shadow-lg"
                         style={{background: 'var(--secondary-charcoal)'}}>
                      4
                    </div>
                    
                    {/* Icon */}
                    <div className="mt-4 mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                           style={{background: 'linear-gradient(135deg, var(--secondary-charcoal) 0%, var(--accent-pine) 100%)'}}>
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold font-roca-two text-center mb-3"
                        style={{color: 'var(--secondary-charcoal)'}}>
                      Get Discovered
                    </h3>
                    <p className="text-center font-canva-sans text-sm leading-relaxed"
                       style={{color: 'var(--secondary-taupe)'}}>
                      <span className="font-semibold" style={{color: 'var(--secondary-charcoal)'}}>Investors</span>, <span className="font-semibold" style={{color: 'var(--secondary-charcoal)'}}>professors</span>, and <span className="font-semibold" style={{color: 'var(--secondary-charcoal)'}}>mentors</span> explore the platform to find promising projects. Your traction opens doors to funding, guidance, and opportunities.
                    </p>
                  </div>
                </div>
              </LazyLoad>
            </div>
          </div>

          {/* Key Features Highlight */}
          <LazyLoad animationType="fade-up" delay={500}>
            <div className="mt-20 bg-gradient-to-br from-orange-50 to-green-50 rounded-3xl p-10 border-2 border-orange-200">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold font-roca-two mb-3"
                    style={{color: 'var(--secondary-charcoal)'}}>
                  🐝 The EntreHive Advantage
                </h3>
                <p className="text-lg font-canva-sans max-w-2xl mx-auto"
                   style={{color: 'var(--secondary-taupe)'}}>
                  More than just a platform - it&apos;s a complete entrepreneurial ecosystem
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full group-hover:scale-110 transition-transform duration-300"
                       style={{backgroundColor: 'var(--primary-orange)'}}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    University Networks
                  </h4>
                  <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Connect with entrepreneurs from your campus and beyond
                  </p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full group-hover:scale-110 transition-transform duration-300"
                       style={{backgroundColor: 'var(--accent-pine)'}}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Real Validation
                  </h4>
                  <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Get genuine feedback from peers, professors, and industry experts
                  </p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full group-hover:scale-110 transition-transform duration-300"
                       style={{backgroundColor: 'var(--accent-terracotta)'}}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="font-bold font-roca-two mb-2" style={{color: 'var(--secondary-charcoal)'}}>
                    Growth Opportunities
                  </h4>
                  <p className="text-sm font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Access funding, mentorship, and partnerships to scale your venture
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10 text-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold font-canva-sans rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'var(--primary-orange)',
                    color: 'white'
                  }}
                >
                  <span>Start Your Journey Today</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Explore Projects Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold font-canva-sans tracking-wide uppercase" style={{color: 'var(--primary-orange)'}}>
                Explore Projects
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold font-roca-two tracking-tight sm:text-4xl"
                 style={{color: 'var(--secondary-charcoal)'}}>
                Discover Innovation in Action
              </p>
              <p className="mt-4 max-w-2xl text-xl font-canva-sans mx-auto"
                 style={{color: 'var(--secondary-taupe)'}}>
                From AI startups to sustainable solutions - see what fellow entrepreneurs are building in the hive
              </p>
            </div>
          </LazyLoad>
          
          <LazyLoad animationType="scale" delay={200}>
            <div className="flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold font-canva-sans rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'var(--accent-pine)',
                  color: 'white'
                }}
              >
                <span>Browse Active Projects</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-hive py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl"
                  style={{color: 'var(--primary-white)'}}>
                Join the University Innovation Movement
              </h2>
              <p className="mt-3 text-xl font-canva-sans sm:mt-4"
                 style={{color: 'var(--primary-white)'}}>
                Students and faculty across universities are already building the future in our hive
              </p>
            </div>
          </LazyLoad>
          <LazyLoad animationType="scale" delay={300}>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium font-canva-sans transition-colors duration-300"
                    style={{color: 'var(--primary-white)'}}>
                  Universities Connected
                </dt>
                <dd className="order-1 text-5xl font-extrabold font-roca-two group-hover:scale-110 transition-transform duration-300"
                    style={{color: 'var(--primary-white)'}}>25+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0 group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium font-canva-sans transition-colors duration-300"
                    style={{color: 'var(--primary-white)'}}>
                  Active Projects
                </dt>
                <dd className="order-1 text-5xl font-extrabold font-roca-two group-hover:scale-110 transition-transform duration-300"
                    style={{color: 'var(--primary-white)'}}>150+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0 group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium font-canva-sans transition-colors duration-300"
                    style={{color: 'var(--primary-white)'}}>
                  Student Entrepreneurs
                </dt>
                <dd className="order-1 text-5xl font-extrabold font-roca-two group-hover:scale-110 transition-transform duration-300"
                    style={{color: 'var(--primary-white)'}}>1000+</dd>
              </div>
            </dl>
          </LazyLoad>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{backgroundColor: 'var(--secondary-charcoal)'}}>
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="mb-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full border-2 border-orange-400 text-orange-400 font-semibold font-canva-sans">
                <span>Bee Entrepreneurial</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-roca-two sm:text-4xl"
                style={{color: 'var(--primary-white)'}}>
              <span className="block">Ready to join the hive?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 font-canva-sans"
               style={{color: 'var(--primary-white)'}}>
              Join thousands of student entrepreneurs turning ideas into reality. Your journey in the entrepreneurial hive starts here.
            </p>
          </LazyLoad>
          <LazyLoad animationType="scale" delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  color: 'white'
                }}
              >
                <span>Enter the Hive</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium font-canva-sans rounded-xl border-2 hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: 'var(--primary-orange)',
                  color: 'var(--primary-orange)',
                  backgroundColor: 'transparent'
                }}
              >
                <span>Explore Projects</span>
              </Link>
            </div>
          </LazyLoad>
        </div>
      </section>

      {/* Cookie Consent Popup */}
      <CookieConsent />
    </div>
  );
}
