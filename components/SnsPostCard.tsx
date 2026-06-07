"use client";

interface SnsPostCardProps {
  title: string;
  description?: string;
  likes: number;
  comments?: number;
  isOwn?: boolean;
  previewMaterial?: string;
}

export default function SnsPostCard({
  title,
  description,
  likes,
  comments,
  isOwn,
  previewMaterial,
}: SnsPostCardProps) {
  return (
    <div className={`border rounded-lg overflow-hidden mb-3 ${isOwn ? "border-gray-200" : "border-gray-300"}`}>
      {/* Image placeholder */}
      <div className="bg-gray-100 flex items-center justify-center h-36 relative">
        {previewMaterial ? (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">PHOTO</div>
            <div className="text-sm text-gray-500 font-medium">{previewMaterial}</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">PLACEHOLDER</div>
            <div className="text-sm text-gray-500 font-medium">{title}</div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>♡ {likes}</span>
          {comments !== undefined && <span>💬 {comments}</span>}
        </div>
      </div>
    </div>
  );
}
