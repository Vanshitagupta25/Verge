'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import api from '../api/api';
import PostCard from '../components/PostCard';
import EmptyFeed from '../components/EmptyFeed';
import FeedHeader from '../components/FeedHeader';
import ImageLightbox from '../components/image-lightbox';
import { DeleteModal } from '../components/DeleteModal';

function AuthScreen({ onAuthenticate }: { onAuthenticate: any }) {
  return <div className="hidden">Auth Redirect...</div>;
}

interface FeedProps {
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  comments: any[];
  channel?: any;
  currentUser: any;
  activeChannelId: string | null;
  isAuthenticated: boolean;
  onAuthenticate: (user: any, token: string) => Promise<void>;
  onLogout: () => void;
  onUpdateUsername: (newUsername: string) => void;
  onUpdateAvatar: (avatarImage: string) => void;
  onOpenSearch: () => void;
}

export default function Feed({
  posts,
  setPosts,
  comments,
  activeChannelId,
  currentUser,
  channel,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onUpdateUsername,
  onUpdateAvatar,
  onOpenSearch,
}: FeedProps) {
  const router = useRouter();

  const [postMetrics, setPostMetrics] = useState<Record<string, any>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = useState<Record<string, boolean>>({});
  const [userDownvotes, setUserDownvotes] = useState<Record<string, boolean>>({});

  const fetchPosts = useCallback(
    async (currentCursor?: string, isChannelSwitch = false) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!isAuthenticated || !token || token === 'null' || token === 'undefined') {
        return;
      }

      if (loading && !isChannelSwitch) return;
      setLoading(true);

      try {
        let url = `/posts?limit=5`;
        if (activeChannelId && activeChannelId !== 'null' && activeChannelId !== 'undefined') {
          url += `&channelId=${activeChannelId}`;
        }
        if (currentCursor) {
          url += `&cursor=${currentCursor}`;
        }

        const response = await api.get(url);
        const { data, meta } = response.data;
        const nextCursor = meta?.nextCursor;
        const backendHasMore = meta?.hasNextPage ?? false;

        const formattedPosts = data.map((post: any) => ({
          ...post,
          _id: post._id,
          id: post._id,
        }));

        setPosts((prev) => {
          if (!currentCursor || isChannelSwitch) {
            return formattedPosts;
          }
          const existingIds = new Set(prev.map((p) => p._id));
          const newPosts = formattedPosts.filter((p: any) => !existingIds.has(p._id));
          return [...prev, ...newPosts];
        });

        setCursor(nextCursor);
        setHasMore(backendHasMore);
      } catch (err) {
        console.error("Fetch posts execution error", err);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [activeChannelId, setPosts, isAuthenticated, loading]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    setCursor(null);
    setHasMore(true);
    fetchPosts(undefined, true);
  }, [activeChannelId, isAuthenticated]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && cursor) {
          fetchPosts(cursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, cursor, fetchPosts]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  useEffect(() => {
    const initialMetrics: Record<string, any> = {};
    posts.forEach((post) => {
      initialMetrics[post._id] = {
        upvotesCount: post.upvotesCount ?? 0,
        downvotesCount: post.downvotesCount ?? 0,
        comments: post.commentsCount || 0,
      };
    });
    setPostMetrics(initialMetrics);
  }, [posts]);

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticate={onAuthenticate} />;
  }

  const handleUpvote = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const isAlreadyUpvoted = !!userUpvotes[postId];
    const upvoteDelta = isAlreadyUpvoted ? -1 : 1;

    setUserUpvotes((prev) => ({ ...prev, [postId]: !isAlreadyUpvoted }));
    const previousMetrics = { ...postMetrics };
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        upvotesCount: Math.max(0, (prev[postId]?.upvotesCount || 0) + upvoteDelta),
      },
    }));

    try {
      await api.post(`votes/${postId}/upvote`);
    } catch (err) {
      setPostMetrics(previousMetrics);
      setUserUpvotes((prev) => ({ ...prev, [postId]: isAlreadyUpvoted }));
      toast.error('Failed to register upvote');
    }
  };

  const handleDownvote = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const isAlreadyDownvoted = !!userDownvotes[postId];
    const downvoteDelta = isAlreadyDownvoted ? -1 : 1;

    setUserDownvotes((prev) => ({ ...prev, [postId]: !isAlreadyDownvoted }));
    const previousMetrics = { ...postMetrics };
    setPostMetrics((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        downvotesCount: Math.max(0, (prev[postId]?.downvotesCount || 0) + downvoteDelta),
      },
    }));

    try {
      await api.post(`votes/${postId}/downvote`);
    } catch (err) {
      setPostMetrics(previousMetrics);
      setUserDownvotes((prev) => ({ ...prev, [postId]: isAlreadyDownvoted }));
      toast.error('Failed to register downvote');
    }
  };

  const toggleExpand = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const navigateToThread = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    localStorage.setItem('verge_posts', JSON.stringify(posts));
    localStorage.setItem('verge_comments', JSON.stringify(comments));
    router.push(`/thread/${postId}`);
  };

  const getUpvoteCount = (postId: string) => postMetrics[postId]?.upvotesCount || 0;
  const getDownvoteCount = (postId: string) => postMetrics[postId]?.downvotesCount || 0;

  const handleDeleteClick = (e: React.MouseEvent, _id: string) => {
    e.stopPropagation();
    setPostToDelete(_id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/posts/${postToDelete}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
        data: { token },
      });

      if (response.status === 200 || response.data?.success) {
        setPosts((prev) => prev.filter((item) => item._id !== postToDelete));
        toast.success('Post Deleted Successfully');
        setIsDeleteModalOpen(false);
        setPostToDelete(null);
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const shouldTruncate = (content?: string) => (content ? content.length > 180 : false);
  const getTruncatedContent = (content?: string) => (content ? content.slice(0, 180) + '...' : '');
  
  const getRelativeTime = (dateString: string): string => {
    if (!dateString) return '';
    const elapsed = new Date().getTime() - new Date(dateString).getTime();
    const mins = Math.round(elapsed / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#111827] overflow-x-hidden">
      <FeedHeader
        channel={channel}
        currentUser={currentUser}
        onOpenSearch={onOpenSearch}
        onUpdateUsername={onUpdateUsername}
        onUpdateAvatar={onUpdateAvatar}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-y-auto py-4">
        <div className="w-full max-w-2xl mx-auto px-4 space-y-4">
          {posts.length === 0 && !loading ? (
            <EmptyFeed />
          ) : (
            posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                postKey={post._id}
                i={index}
                posts={posts}
                lastPostRef={lastPostRef}
                authorName={post.authorName || 'Anonymous'}
                canDelete={currentUser?.role === 'admin' || currentUser?._id === post.userId}
                expandedPosts={expandedPosts}
                userUpvotes={userUpvotes}
                userDownvotes={userDownvotes}
                getRelativeTime={getRelativeTime}
                shouldTruncate={shouldTruncate}
                getTruncatedContent={getTruncatedContent}
                toggleExpand={toggleExpand}
                handleDeleteClick={handleDeleteClick}
                handleUpvote={handleUpvote}
                handleDownvote={handleDownvote}
                navigateToThread={navigateToThread}
                getUpvoteCount={getUpvoteCount}
                getDownvoteCount={getDownvoteCount}
              />
            ))
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        isLoading={loading}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={currentUser?.role === 'admin' ? "Admin: Delete Post?" : "Delete Post?"}
        description="Are you sure you want to permanently delete this post?"
      />

      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        postId={lightboxImage?.postId}
        imageUrl={lightboxImage?.url || null}
        metrics={lightboxImage?.metrics}
      />
    </div>
  );
}