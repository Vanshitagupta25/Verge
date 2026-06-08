'use client';

import PostCardHeader from './PostCardHeader';
import PostCardContent from './PostCardContent';
import PostActions from './PostActions';

interface PostCardProps {
  post: any;
  postKey: string;
  i: number;
  posts: any[];
  lastPostRef: (node: HTMLDivElement | null) => void;
  authorName: string;
  canDelete: boolean;
  expandedPosts: Record<string, boolean>;
  userUpvotes: Record<string, boolean>;
  userDownvotes: Record<string, boolean>;
  getRelativeTime: (date: string) => string;
  getTruncatedContent: (content: string) => string;
  shouldTruncate: (content: string) => boolean;
  toggleExpand: (e: React.MouseEvent, postId: string) => void;
  handleDeleteClick: (e: React.MouseEvent, postId: string) => void;
  handleUpvote: (e: React.MouseEvent, postId: string) => void;
  handleDownvote: (e: React.MouseEvent, postId: string) => void;
  navigateToThread: (e: React.MouseEvent, postId: string) => void;
  getUpvoteCount: (postId: string) => number;
  getDownvoteCount: (postId: string) => number;
}

export default function PostCard({
  post,
  postKey,
  i,
  posts,
  lastPostRef,
  authorName,
  canDelete,
  expandedPosts,
  userUpvotes,
  userDownvotes,
  getRelativeTime,
  getTruncatedContent,
  shouldTruncate,
  toggleExpand,
  handleDeleteClick,
  handleUpvote,
  handleDownvote,
  navigateToThread,
  getUpvoteCount,
  getDownvoteCount,
}: PostCardProps) {
  return (
    <div
      ref={i === posts.length - 1 ? lastPostRef : null}
      className="p-4 md:p-6 bg-[#1f2937]/40 hover:bg-[#1f2937]/70 border border-[#2d3748] rounded-xl cursor-pointer group transition-all duration-200"
      onClick={(e) => navigateToThread(e, post._id)}
    >
      <div className="flex-1 min-w-0 space-y-3">
        <PostCardHeader
          authorName={authorName}
          createdAt={post.createdAt}
          color={post.color}
          canDelete={canDelete}
          postId={post._id}
          getRelativeTime={getRelativeTime}
          onDelete={handleDeleteClick}
        />

        <PostCardContent
          content={post.content}
          postId={post._id}
          expanded={!!expandedPosts[post._id]}
          shouldTruncate={shouldTruncate}
          getTruncatedContent={getTruncatedContent}
          onToggleExpand={toggleExpand}
        />

        <PostActions
          postId={post._id}
          commentsCount={post?.commentsCount ?? 0}
          upvotes={getUpvoteCount(post._id)}
          downvotes={getDownvoteCount(post._id)}
          userUpvoted={!!userUpvotes[post._id]}
          userDownvoted={!!userDownvotes[post._id]}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onNavigateThread={navigateToThread}
        />
      </div>
    </div>
  );
}