'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyFeed() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center px-6"
    >
      <div className="w-16 h-16 rounded-full bg-[#1f2937] flex items-center justify-center mb-4">
        <MessageCircle
          size={28}
          className="text-[#00A870]"
        />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        No Posts Yet
      </h3>

      <p className="text-sm text-gray-400 max-w-md">
        Be the first person to start a discussion in this channel.
      </p>
    </motion.div>
  );
}