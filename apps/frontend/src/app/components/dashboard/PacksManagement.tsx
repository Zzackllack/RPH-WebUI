'use client';

import type { FilterOptions, ResourcePack } from '@/app/types';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Filter, Grid, List, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function PacksManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    mcVersion: [],
    tags: [],
    sortBy: 'downloads',
    verified: false,
  });
  const [packs, setPacks] = useState<ResourcePack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks`)
      .then(res => res.json())
      .then((data: ResourcePack[]) => {
        if (!ignore) setPacks(data);
      })
      .catch(() => {
        if (!ignore) setPacks([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredPacks = useMemo(() => {
    let filtered = packs;

    if (filters.search) {
      filtered = filtered.filter(pack =>
        pack.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pack.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.mcVersion.length > 0) {
      filtered = filtered.filter(pack =>
        pack.mcVersion.some(version => filters.mcVersion.includes(version))
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(pack =>
        pack.tags.some(tag => filters.tags.includes(tag))
      );
    }

    if (filters.verified) {
      filtered = filtered.filter(pack => pack.verified);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, packs]);

  const PackCard = ({ pack }: { pack: ResourcePack }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="minecraft-card p-6 group hover:scale-105 transition-all duration-300"
    >
      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
        <img
          src={pack.thumbnail}
          alt={pack.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
          {pack.name}
        </h3>
        {pack.featured && (
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {pack.description}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{pack.downloads.toLocaleString()} downloads</span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          {pack.rating}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {pack.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {format(new Date(pack.updatedAt), 'MMM d, yyyy')}
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const PackRow = ({ pack }: { pack: ResourcePack }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="minecraft-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
    >
      <img
        src={pack.thumbnail}
        alt={pack.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">{pack.name}</h3>
          {pack.featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">{pack.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{pack.downloads.toLocaleString()} downloads</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            {pack.rating}
          </span>
          <span>{pack.size}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="minecraft-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Resource Packs</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search packs..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="downloads">Most Downloaded</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Pack Grid/List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPacks.map(pack => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredPacks.map(pack => (
                <PackRow key={pack.id} pack={pack} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!loading && filteredPacks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packs found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </motion.div>
  );
}
