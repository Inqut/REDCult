import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContentUploader } from './ContentUploader';
import { ContentList } from './ContentList';
import { useCultContent } from '../../../hooks/useCultContent';

interface CultContentProps {
  cultId: string;
}

export const CultContent = ({ cultId }: CultContentProps) => {
  const [showUploader, setShowUploader] = useState(false);
  const { content, loading, error, refresh } = useCultContent(cultId);

  const handleUploadComplete = () => {
    setShowUploader(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content</h2>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 bg-crimson text-white px-4 py-2 rounded-lg hover:bg-crimson-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      {showUploader && (
        <div className="bg-crimson-darker p-6 rounded-lg">
          <ContentUploader cultId={cultId} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : loading ? (
        <div className="text-center py-4">Loading content...</div>
      ) : (
        <ContentList items={content} />
      )}
    </div>
  );
};