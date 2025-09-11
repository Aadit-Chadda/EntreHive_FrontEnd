import Link from 'next/link';
import LazyLoad from './components/LazyLoad';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline">Where Students</span>{' '}
                  <span className="block gradient-text xl:inline">Build the Future</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up stagger-2">
                  A peer-to-peer platform connecting student entrepreneurs, investors, and service providers. 
                  Turn your ideas into reality with real-world experience and university collaboration.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in-up stagger-3">
                  <div className="rounded-md shadow transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                    >
                      🎓 Join as a Student
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transform hover:scale-105 transition-all duration-300">
                    <Link
                      href="/services"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-300"
                    >
                      🔍 Explore Projects
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 transform rotate-3 animate-float opacity-10"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-full flex items-center justify-center overflow-hidden">
              
              {/* Animated network nodes */}
              <div className="absolute inset-0">
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
                    </linearGradient>
                  </defs>
                  <path d="M100,100 L300,150 L200,300 L100,250 Z" stroke="url(#lineGrad)" strokeWidth="2" fill="none" className="animate-pulse" />
                  <path d="M200,50 L300,150 M150,200 L250,100" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                </svg>
                
                {/* Floating nodes */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white bg-opacity-40 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white bg-opacity-30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-white bg-opacity-35 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white bg-opacity-40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              </div>
              
              {/* Central hub */}
              <div className="relative text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white bg-opacity-95 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-blue-200 hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl animate-glow">
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-bounce">🚀</div>
                    <div className="text-sm font-bold text-gray-800">EntreHive</div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-blue-200 shadow-lg">
                  <p className="text-lg font-semibold text-gray-800 animate-fade-in-up">Student Innovation Hub</p>
                  <div className="mt-3 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Why EntreHive</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Built for Students, by Students
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                No hierarchy. No barriers. Just pure collaboration between university minds ready to change the world.
              </p>
            </div>
          </LazyLoad>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <LazyLoad animationType="fade-left" delay={100}>
                <div className="relative group hover-lift">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">🎯</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-World Skill Building</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Craft real pitch decks, run marketing campaigns, and get feedback from industry professionals. 
                    Learn by doing, not just reading.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={200}>
                <div className="relative group hover-lift">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">🤝</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Peer Collaboration</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Join plug-and-play teams, connect across disciplines, and build lasting partnerships 
                    with like-minded innovators.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-left" delay={300}>
                <div className="relative group hover-lift">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">💼</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Alternative to Internships</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Skip the competitive internship hunt. Gain hands-on experience with early-stage startups 
                    and real business challenges.
                  </dd>
                </div>
              </LazyLoad>

              <LazyLoad animationType="fade-right" delay={400}>
                <div className="relative group hover-lift">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl">🌟</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">No Hierarchy</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Whether you're a student or professor, entrepreneur or investor - your ideas matter. 
                    Expertise trumps titles every time.
                  </dd>
                </div>
              </LazyLoad>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <LazyLoad animationType="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Join the University Innovation Movement
              </h2>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Students and faculty across universities are already building the future
              </p>
            </div>
          </LazyLoad>
          <LazyLoad animationType="scale" delay={300}>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Universities Connected
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform duration-300">25+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0 group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Active Projects
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform duration-300">150+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0 group hover-lift">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Student Entrepreneurs
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform duration-300">1000+</dd>
              </div>
            </dl>
          </LazyLoad>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <LazyLoad animationType="fade-up">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to build something amazing?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-200">
              Join thousands of students turning ideas into reality. Your university journey starts here.
            </p>
          </LazyLoad>
          <LazyLoad animationType="scale" delay={300}>
            <Link
              href="/signup"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 hover:scale-105 sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </Link>
          </LazyLoad>
        </div>
      </section>
    </div>
  );
}
