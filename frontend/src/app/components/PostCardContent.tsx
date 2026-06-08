'use client';

interface PostCardContentProps {
  content: string;
  postId: string;
  expanded: boolean;

  shouldTruncate: (
    content: string
  ) => boolean;

  getTruncatedContent: (
    content: string
  ) => string;

  onToggleExpand: (
    e: React.MouseEvent,
    postId: string
  ) => void;
}

export default function PostCardContent({
  content,
  postId,
  expanded,
  shouldTruncate,
  getTruncatedContent,
  onToggleExpand,
}: PostCardContentProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-200 leading-relaxed">
        {shouldTruncate(content) && !expanded
          ? getTruncatedContent(content)
          : content}
      </p>

      {shouldTruncate(content) && (
        <button
          onClick={(e) =>
            onToggleExpand(e, postId)
          }
          className="mt-2 text-sm font-medium text-[#00A870]"
        >
          {expanded
            ? 'Read Less'
            : 'Read More'}
        </button>
      )}
    </div>
  );
}