'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Download, Package, TrendingUp, Users } from 'lucide-react';

export function StatsCards() {
  const { user } = useAuth();

  const stats = [
    {
      icon: Package,
      label: 'Your Packs',
      value: user?.packCount || 0,
      change: '+2 this month',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Download,
      label: 'Total Downloads',
      value: user?.totalDownloads || 0,
      change: '+234 this week',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      label: 'Followers',
      value: 128,
      change: '+12 this week',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      label: 'Average Rating',
      value: '4.8',
      change: '+0.2 this month',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="minecraft-card p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className="text-sm text-green-600 font-medium">{stat.change}</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </div>
          
          <div className="text-sm text-gray-600">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}