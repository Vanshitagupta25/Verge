'use client';

import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';

interface PostActionsProps {
  postId: string;

  commentsCount: number;
  upvotes: number;
  downvotes: number;

  userUpvoted: boolean;
  userDownvoted: boolean;

  onUpvote: (
    e: React.MouseEvent,
    postId: string
  ) => void;

  onDownvote: (
    e: React.MouseEvent,
    postId: string
  ) => void;

  onNavigateThread: (
    e: React.MouseEvent,
    postId: string
  ) => void;
}

export default function PostActions({
  postId,
  commentsCount,
  upvotes,
  downvotes,
  userUpvoted,
  userDownvoted,
  onUpvote,
  onDownvote,
  onNavigateThread,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4 md:gap-6 pt-1 text-xs font-medium">
      <div className="flex items-center gap-1.5 text-gray-400">
        <button
          onClick={(e) =>
            onUpvote(e, postId)
          }
          className={`p-1.5 rounded-lg transition-colors ${
            userUpvoted
              ? 'bg-[#00A870]/30 text-[#00A870]'
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <ChevronUp size={18} />
        </button>

        <span className={userUpvoted ? 'text-[#00A870]' : ''}>
          {upvotes}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-gray-400">
        <button
          onClick={(e) =>
            onDownvote(e, postId)
          }
          className={`p-1.5 rounded-lg transition-colors ${
            userDownvoted
              ? 'bg-red-500/30 text-red-400'
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <ChevronDown size={18} />
        </button>

        <span className={userDownvoted ? 'text-red-400' : ''}>
          {downvotes}
        </span>
      </div>

      <button
        onClick={(e) =>
          onNavigateThread(e, postId)
        }
        className="flex items-center gap-1.5 text-gray-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        <MessageCircle size={18} />
        <span>{commentsCount}</span>
      </button>
    </div>
  );
}