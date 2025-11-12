'use client';

import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Sparkles } from 'lucide-react';

interface CreateProjectCardProps {
  onClick: () => void;
}

export default function CreateProjectCard({ onClick }: CreateProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border-2 cursor-pointer group backdrop-blur-lg"
      style={{
        background: 'linear-gradient(135deg, rgba(243, 172, 59, 0.95) 0%, rgba(231, 159, 116, 0.95) 50%, rgba(138, 107, 83, 0.95) 100%)',
        borderColor: '#F3AC3B',
        boxShadow: '0 10px 25px -5px rgba(243, 172, 59, 0.2), 0 8px 10px -6px rgba(243, 172, 59, 0.1)',
      }}
      onClick={onClick}
    >
      {/* Animated hexagon background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="hexagon absolute"
            style={{
              top: `${10 + (i % 3) * 30}%`,
              left: `${10 + (i % 2) * 40}%`,
              width: '60px',
              height: '60px',
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Text content */}
          <div className="flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            <motion.h3
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold font-roca-two text-white mb-2"
            >
              Launch Your Project
            </motion.h3>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base font-canva-sans text-white/90 mb-4"
            >
              Share your entrepreneurial vision with the Hive. Connect with teammates, find mentors, and bring your ideas to life.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-canva-sans shadow-lg transition-all duration-300 group-hover:shadow-xl"
              style={{
                backgroundColor: 'white',
                color: '#36454F',
                border: '2px solid white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#214F38';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#214F38';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#36454F';
                e.currentTarget.style.borderColor = 'white';
              }}
            >
              <Rocket className="w-5 h-5" />
              Create Project
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.button>
          </div>

          {/* Right side - Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="hidden md:block"
          >
            <motion.div
              animate={{
                y: [-5, 5, -5],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl"
            >
              <Lightbulb className="w-14 h-14 text-white" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>

        {/* Pulse effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: '#214F38' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
    </motion.div>
  );
}
