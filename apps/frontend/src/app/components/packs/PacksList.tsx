"use client";

import { motion } from 'framer-motion';

const mockPacks = [
  {
    id: '1',
    name: 'Faithful 32x',
    description: 'A high-resolution texture pack that maintains the original look of Minecraft',
    downloads: 15423,
    size: '24.5 MB',
    thumbnail: 'https://images.pexels.com/photos/1576190/pexels-photo-1576190.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: '2',
    name: 'Modern HD',
    description: 'Contemporary textures with photorealistic details',
    downloads: 8901,
    size: '48.2 MB',
    thumbnail: 'https://images.pexels.com/photos/1576190/pexels-photo-1576190.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: '3',
    name: 'Medieval Fantasy',
    description: 'Transport your world to the medieval times',
    downloads: 12567,
    size: '35.8 MB',
    thumbnail: 'https://images.pexels.com/photos/1576190/pexels-photo-1576190.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
];

function PackCard({ pack }: { pack: typeof mockPacks[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="glass-effect rounded-xl p-4 shadow-lg flex flex-col items-center text-center transition-all duration-300"
    >
      <img
        src={pack.thumbnail}
        alt={pack.name}
        className="w-full h-32 object-cover rounded-lg mb-4 shadow-md"
      />
      <h3 className="font-semibold text-gray-900 mb-1">{pack.name}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{pack.description}</p>
      <div className="flex justify-between w-full text-xs text-gray-500 mt-auto">
        <span>{pack.downloads.toLocaleString()} downloads</span>
        <span>{pack.size}</span>
      </div>
    </motion.div>
  );
}

export function PacksList() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    >
      {mockPacks.map(pack => (
        <PackCard key={pack.id} pack={pack} />
      ))}
    </motion.section>
  );
}
