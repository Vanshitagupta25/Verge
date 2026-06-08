'use client';

import { Trash2 } from 'lucide-react';

interface PostCardHeaderProps {
  authorName: string;
  createdAt: string;
  color?: string;
  canDelete: boolean;
  postId: string;

  getRelativeTime: (date: string) => string;

  onDelete: (
    e: React.MouseEvent,
    postId: string
  ) => void;
}

export default function PostCardHeader({
  authorName,
  createdAt,
  color,
  canDelete,
  postId,
  getRelativeTime,
  onDelete,
}: PostCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3 justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full ${
            color || 'bg-emerald-600'
          } flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
        >
          {authorName
            ? authorName.charAt(0).toUpperCase()
            : 'P'}
        </div>

        <span className="font-mono font-semibold text-white text-sm">
          {authorName}
        </span>

        <span className="text-xs text-gray-500">
          · {getRelativeTime(createdAt || '')}
        </span>
      </div>

      <button
        type="button"
        disabled={!canDelete}
        onClick={(e) => onDelete(e, postId)}
        className={`p-1.5 transition-all duration-200 rounded-lg ${
          canDelete
            ? 'text-red-400 opacity-100 hover:bg-red-500/10 cursor-pointer'
            : 'text-gray-600 opacity-30 cursor-not-allowed'
        }`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
