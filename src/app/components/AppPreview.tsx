'use client';

import { motion } from 'framer-motion';
import { Bell, Users, Home, Briefcase, Mail, User, Clock, Calendar, TrendingUp } from 'lucide-react';

export default function AppPreview() {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-0">
      {/* Browser Chrome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: 'var(--secondary-charcoal)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Browser Header */}
        <div className="px-4 py-3 flex items-center space-x-2 border-b border-white/10">
          {/* Traffic Lights */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* Browser Tab */}
          <div className="flex-1 flex items-center ml-4">
            <div className="px-4 py-1.5 rounded-t-lg text-sm flex items-center space-x-2"
                 style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}>
              <div className="w-4 h-4 rounded flex items-center justify-center overflow-hidden bg-white">
                <span className="text-xs font-bold" style={{ color: 'var(--primary-orange)' }}>E</span>
              </div>
              <span>EntreHive</span>
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="bg-white" style={{ height: '650px', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Left Navigation - Hidden on mobile */}
            <div className="hidden md:flex w-48 lg:w-64 border-r flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              {/* Logo */}
              <div className="p-4 lg:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center overflow-hidden p-1"
                       style={{ backgroundColor: 'var(--primary-orange)' }}>
                    <img src="/Logoblacktransparent.png" alt="EntreHive" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-base lg:text-lg font-roca-two hidden lg:inline" style={{ color: 'var(--text-primary)' }}>
                    EntreHive
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2">
                <div className="px-2 lg:px-4 py-2 lg:py-3 rounded-lg flex items-center space-x-2 lg:space-x-3 transition-all"
                     style={{ backgroundColor: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>
                  <Home className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-xs lg:text-sm">Feed</span>
                </div>

                <div className="px-2 lg:px-4 py-2 lg:py-3 rounded-lg flex items-center space-x-2 lg:space-x-3 transition-all"
                     style={{ color: 'var(--text-secondary)' }}>
                  <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-xs lg:text-sm">Explore</span>
                </div>

                <div className="px-2 lg:px-4 py-2 lg:py-3 rounded-lg flex items-center space-x-2 lg:space-x-3 transition-all"
                     style={{ color: 'var(--text-secondary)' }}>
                  <Briefcase className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-xs lg:text-sm">Projects</span>
                </div>

                <div className="px-2 lg:px-4 py-2 lg:py-3 rounded-lg flex items-center space-x-2 lg:space-x-3 transition-all"
                     style={{ color: 'var(--text-secondary)' }}>
                  <Mail className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-xs lg:text-sm">Inbox</span>
                </div>
              </nav>

              {/* Profile at bottom */}
              <div className="p-2 lg:p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="px-2 lg:px-4 py-2 lg:py-3 rounded-lg flex items-center space-x-2 lg:space-x-3 transition-all cursor-pointer"
                     style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--hover-bg)' }}>
                  <User className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-xs lg:text-sm">Profile</span>
                </div>
              </div>
            </div>

            {/* Main Feed Area */}
            <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
              <div className="h-full overflow-y-auto">
                {/* Feed Header */}
                <div className="sticky top-0 z-10 px-3 lg:px-6 py-3 lg:py-4 border-b backdrop-blur-lg"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <button className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium"
                            style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}>
                      Home
                    </button>
                    <button className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium"
                            style={{ color: 'var(--text-secondary)' }}>
                      University
                    </button>
                    <button className="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium"
                            style={{ color: 'var(--text-secondary)' }}>
                      Global
                    </button>
                  </div>
                </div>

                {/* Mock Posts */}
                <div className="p-3 lg:p-6 space-y-3 lg:space-y-4">
                  {/* Post 1 */}
                  <div className="p-3 lg:p-6 rounded-lg lg:rounded-xl border"
                       style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start space-x-2 lg:space-x-3">
                      <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-base"
                           style={{ backgroundColor: 'var(--accent-pine)' }}>
                        JS
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm lg:text-base truncate" style={{ color: 'var(--text-primary)' }}>Jane Smith</span>
                          <span className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>2h ago</span>
                        </div>
                        <p className="mt-1 lg:mt-2 text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Just launched our MVP for our sustainable packaging startup! Looking for feedback from the community.
                        </p>
                        <div className="mt-2 lg:mt-3 flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>
                          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <span>❤️</span>
                            <span>24</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                            <span>💬</span>
                            <span>8</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Card */}
                  <div className="p-3 lg:p-6 rounded-lg lg:rounded-xl border overflow-hidden"
                       style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--primary-orange)' }}>
                    <div className="flex items-start space-x-2 lg:space-x-3 mb-3">
                      <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-base"
                           style={{ backgroundColor: 'var(--accent-pine)' }}>
                        TC
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm lg:text-base truncate" style={{ color: 'var(--text-primary)' }}>Tom Chen</span>
                              <span className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>3h ago</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--neutral-light-orange)', color: 'var(--primary-orange)' }}>Project</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-24 lg:h-32 rounded-lg mb-2 flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, var(--accent-pine) 0%, var(--primary-orange) 100%)' }}>
                      <span className="text-2xl lg:text-4xl">🚀</span>
                    </div>
                    <h3 className="font-bold text-sm lg:text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                      EcoTrack - Sustainability App
                    </h3>
                    <p className="text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Track your carbon footprint and discover eco-friendly alternatives. Join our mission to make sustainability accessible.
                    </p>
                    <div className="mt-2 lg:mt-3 flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>
                      <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                        <span>❤️</span>
                        <span>67</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>5 members</span>
                      </span>
                    </div>
                  </div>

                  {/* Post 2 */}
                  <div className="p-3 lg:p-6 rounded-lg lg:rounded-xl border"
                       style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start space-x-2 lg:space-x-3">
                      <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-base"
                           style={{ backgroundColor: 'var(--accent-terracotta)' }}>
                        MJ
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm lg:text-base truncate" style={{ color: 'var(--text-primary)' }}>Mike Johnson</span>
                          <span className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>5h ago</span>
                        </div>
                        <p className="mt-1 lg:mt-2 text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Our AI tutoring platform just reached 500 students! Thanks to everyone who believed in our vision.
                        </p>
                        <div className="mt-2 lg:mt-3 flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>
                          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <span>❤️</span>
                            <span>42</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                            <span>💬</span>
                            <span>15</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post 3 */}
                  <div className="p-3 lg:p-6 rounded-lg lg:rounded-xl border"
                       style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start space-x-2 lg:space-x-3">
                      <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-base"
                           style={{ backgroundColor: 'var(--primary-orange)' }}>
                        SK
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm lg:text-base truncate" style={{ color: 'var(--text-primary)' }}>Sarah Kim</span>
                          <span className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>1d ago</span>
                        </div>
                        <p className="mt-1 lg:mt-2 text-xs lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Looking for a co-founder with marketing experience for our health tech startup. DM me if interested!
                        </p>
                        <div className="mt-2 lg:mt-3 flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>
                          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <span>❤️</span>
                            <span>18</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                            <span>💬</span>
                            <span>12</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Hidden on mobile and tablet */}
            <div className="hidden lg:block w-80 border-l overflow-y-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              {/* Time and Date */}
              <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
                    <span className="text-2xl font-bold">2:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar className="w-4 h-4" />
                    <span>Monday, November 20</span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Bell className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
                    <span>Notifications</span>
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded-full text-white"
                        style={{ backgroundColor: 'var(--secondary-red)' }}>
                    3
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg border"
                       style={{ backgroundColor: 'var(--neutral-light-orange)', borderColor: 'var(--primary-orange)' }}>
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                           style={{ backgroundColor: 'var(--accent-pine)' }}>
                        AJ
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          New follower
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          Alex Johnson started following you
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          5m ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border"
                       style={{ backgroundColor: 'transparent', borderColor: 'var(--border)' }}>
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <span>❤️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          Post liked
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          Emma liked your post
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          1h ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Who to Follow */}
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--primary-orange)' }} />
                  <span>Who to Follow</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                           style={{ backgroundColor: 'var(--accent-terracotta)' }}>
                        DL
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>David Lee</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@davidlee</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs rounded-lg font-medium text-white"
                            style={{ backgroundColor: 'var(--primary-orange)' }}>
                      Follow
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                           style={{ backgroundColor: 'var(--accent-pine)' }}>
                        RW
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Rachel Wang</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@rachelw</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs rounded-lg font-medium text-white"
                            style={{ backgroundColor: 'var(--primary-orange)' }}>
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-sm font-canva-sans" style={{ color: 'var(--text-muted)' }}>
          This is a preview of the EntreHive platform
        </p>
      </motion.div>
    </div>
  );
}
