'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, Star, Users } from 'lucide-react';

export function RestrictedAccess() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Packs',
      description: 'All uploads are verified for safety and quality',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of creators sharing their work',
    },
    {
      icon: Star,
      title: 'Top Quality',
      description: 'Curated collection of the best resource packs',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 pulse-glow">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Join the Community
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sign up to access our full library of resource packs, upload your own creations, 
            and connect with fellow Minecraft enthusiasts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="minecraft-card p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="glass-effect max-w-2xl mx-auto p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Create your account today and become part of the largest Minecraft resource pack community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="minecraft-button">
                Create Free Account
              </button>
              <button className="bg-white/80 backdrop-blur-md text-gray-900 font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 border border-gray-200/50">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}