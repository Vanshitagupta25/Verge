'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

import ProfileToggle from './profile-toggle';

import type { Channel , User } from '../types/user'

interface FeedHeaderProps {
  channel?: Channel;
  currentUser: User | null;
  onOpenSearch: () => void;
  onUpdateUsername: (name: string) => void;
  onUpdateAvatar: (avatar: string) => void;
  onLogout: () => void;
}

export default function FeedHeader({
  channel,
  currentUser,
  onOpenSearch,
  onUpdateUsername,
  onUpdateAvatar,
  onLogout,
}: FeedHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 md:px-6 py-4 border-b border-[#374151] bg-[#006239] sticky top-0 z-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            #{channel?.name || 'general'}
          </h2>

          <p className="text-xs text-white/70 mt-1">
            {channel?.description || 'Discussions'}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSearch}
            className="p-2 transition-colors"
            title="Search"
          >
            <Search
              size={18}
              className="text-white/80 hover:text-white"
            />
          </motion.button>

          {currentUser && (
            <ProfileToggle
              currentUser={currentUser}
              onUpdateUsername={onUpdateUsername}
              onUpdateAvatar={onUpdateAvatar}
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}