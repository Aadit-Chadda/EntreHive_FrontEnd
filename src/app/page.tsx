import Link from 'next/link';
import LazyLoad from './components/LazyLoad';

export default function Home() {
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
                {/* Entrepreneurial Badge */}
                <div className="mb-6 flex sm:justify-center lg:justify-start">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold font-canva-sans" 
                       style={{background: 'var(--primary-orange)', color: 'white'}}>
                    <span className="font-roca-two">Bee Entrepreneurial</span>
                  </div>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold font-roca-two sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline" style={{color: 'var(--secondary-charcoal)'}}>Where Students</span>{' '}
                  <span className="block xl:inline" style={{color: 'var(--primary-orange)'}}>Build the Future</span>
                </h1>
                <p className="mt-3 text-base font-canva-sans sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up stagger-2"
                   style={{color: 'var(--secondary-taupe)'}}>
                  A hive for entrepreneurs to connect. Our peer-to-peer platform brings together student entrepreneurs, 
                  investors, and service providers to turn ideas into reality through real-world experience and university collaboration.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in-up stagger-3">
                  <div className="rounded-md shadow transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/feed"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium font-canva-sans rounded-md text-white hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                      style={{background: 'var(--accent-pine)'}}
                    >
                      Enter the Hive
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium font-canva-sans rounded-md hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                      style={{
                        color: 'var(--primary-orange)', 
                        backgroundColor: 'var(--neutral-light-orange)',
                        borderColor: 'var(--primary-orange)'
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
                      src="/logo_official.jpeg" 
                      alt="EntreHive Logo" 
                      className="w-16 h-16 rounded-full object-cover animate-bee-hover"
                    />
                    <div className="text-xs font-bold font-roca-two mt-2" style={{color: 'var(--primary-orange)'}}>EntreHive</div>
                  </div>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 shadow-lg"
                     style={{borderColor: 'var(--primary-orange)'}}>
                  <p className="text-lg font-semibold font-roca-two animate-fade-in-up" style={{color: 'var(--text-primary)'}}>The Entrepreneurial Hive</p>
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
      <section className="py-12 hexagon-pattern" style={{backgroundColor: 'var(--neutral-off-white)'}}>
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
                  <span className="text-lg mr-2">🤝</span>
                  <span>Peer-to-Peer Connection Platform</span>
                </div>
              </div>
            </div>
          </LazyLoad>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <LazyLoad animationType="fade-left" delay={100}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300 hexagon">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Real-World Skill Building</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Craft real pitch decks, run marketing campaigns, and get feedback from industry professionals. 
                    Learn by doing, not just reading - the hive way.
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
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Peer-to-Peer Collaboration</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Join plug-and-play teams, connect across disciplines, and build lasting partnerships 
                    with like-minded innovators in the entrepreneurial ecosystem.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-left" delay={300}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--accent-terracotta)'}}>
                      <span className="text-2xl">💼</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>Alternative to Internships</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Skip the competitive internship hunt. Gain hands-on experience with early-stage startups 
                    and real business challenges in our collaborative hive.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={400}>
                <div className="relative group hover-lift p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-orange-200 transition-all duration-300">
                  <dt>
                    <div className="absolute -top-4 -left-4 flex items-center justify-center h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300"
                         style={{backgroundColor: 'var(--secondary-red)'}}>
                      <span className="text-2xl">🌟</span>
                    </div>
                    <p className="ml-4 text-xl leading-6 font-semibold font-roca-two" style={{color: 'var(--secondary-charcoal)'}}>No Hierarchy, Pure Collaboration</p>
                  </dt>
                  <dd className="mt-4 ml-4 text-base font-canva-sans" style={{color: 'var(--secondary-taupe)'}}>
                    Whether you're a student or professor, entrepreneur or investor - your ideas matter. 
                    In our hive, expertise trumps titles every time.
                  </dd>
                </div>
              </LazyLoad>
            </div>
          </div>
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
    </div>
  );
}
