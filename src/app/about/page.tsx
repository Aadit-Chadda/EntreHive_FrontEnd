import Link from 'next/link';

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-yellow-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="gradient-text">About EntreHive</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Bridging the gap between student entrepreneurs, investors, and service providers 
              through collaborative university ecosystems.
            </p>
            
            {/* Interactive elements */}
            <div className="mt-8 flex justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full hover-lift">
                <span className="text-2xl">🎓</span>
                <span className="text-sm font-medium text-blue-700">Students</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full hover-lift" style={{ animationDelay: '0.2s' }}>
                <span className="text-2xl">👨‍🏫</span>
                <span className="text-sm font-medium text-purple-700">Faculty</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full hover-lift" style={{ animationDelay: '0.4s' }}>
                <span className="text-2xl">🤝</span>
                <span className="text-sm font-medium text-green-700">Together</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Fostering Entrepreneurial Growth
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 lg:mx-auto">
              Our mission is to create a collaborative ecosystem that fosters entrepreneurial growth 
              by providing access to resources, funding, and expertise within university communities.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl">🎓</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">University-Focused</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Built specifically for university environments, understanding the unique needs of students and faculty.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <span className="text-xl">🤝</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Peer-to-Peer</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Direct connections between students, removing traditional barriers and hierarchies.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Innovation-Driven</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Focused on turning ideas into reality through practical experience and real-world applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Built Around Two Core University Groups
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 lg:mx-auto">
              Students and Professors/Faculty working together without hierarchy.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Students Side */}
              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">👨‍🎓 Students</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Real-World Skill Building:</strong> Craft real pitch decks, run marketing campaigns, 
                      and manage projects with actual deadlines and stakeholders.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Peer Collaboration:</strong> Join plug-and-play teams and connect with students 
                      from different disciplines for diverse perspectives.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Alternative to Internships:</strong> Gain hands-on experience without formal applications 
                      or competitive job listings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Faculty Side */}
              <div className="bg-purple-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">👩‍🏫 Professors/Faculty</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Share Expertise:</strong> Provide mentorship and guidance based on years of 
                      academic and industry experience.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Invest & Support:</strong> Contribute resources, funding, or services to 
                      promising student ventures.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500 text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong>Learn & Innovate:</strong> Stay connected with emerging trends and collaborate 
                      on cutting-edge projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Hierarchy Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Here&apos;s the Catch — No Hierarchy
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Your role isn&apos;t limited by your title. Whether you&apos;re a student, professor, or faculty member — 
            you can be an entrepreneur, an investor, a mentor, or someone offering services.
          </p>
          <div className="mt-8 bg-white bg-opacity-10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg text-white font-medium">
              💡 What matters is your <span className="font-bold">idea</span>, your <span className="font-bold">interest</span>, or your <span className="font-bold">expertise</span> — not your position at the university.
            </p>
            <div className="mt-4 flex justify-center space-x-4 text-sm text-blue-100">
              <span>🎓 Students</span>
              <span>👨‍🏫 Faculty</span>
              <span>🤝 Equals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Vision</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The Future of University Innovation
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 lg:mx-auto">
              We envision universities as thriving entrepreneurial ecosystems where every student has the 
              opportunity to turn their ideas into reality, backed by a supportive community of peers and mentors.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500 text-white mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nurture Ideas</h3>
              <p className="mt-2 text-gray-500">
                Provide the soil for innovative ideas to grow and flourish in university environments.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Connect Minds</h3>
              <p className="mt-2 text-gray-500">
                Bridge gaps between different disciplines, backgrounds, and expertise levels.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500 text-white mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Drive Impact</h3>
              <p className="mt-2 text-gray-500">
                Create meaningful change through student-driven innovation and entrepreneurship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Ready to be part of the movement?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            Join EntreHive today and start building the future with fellow university innovators.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 sm:w-auto transition-colors duration-200"
          >
            Join EntreHive
          </Link>
        </div>
      </section>
    </div>
  );
}
