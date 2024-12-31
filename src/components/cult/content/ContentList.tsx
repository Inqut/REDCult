import React from 'react';
import { FileText, Link, Image, Video, ExternalLink, Download } from 'lucide-react';
import { ContentItem, ContentType } from '../../../types/content';

interface ContentListProps {
  items: ContentItem[];
}

const getContentIcon = (type: ContentType) => {
  switch (type) {
    case 'text':
      return <FileText className="w-5 h-5" />;
    case 'link':
      return <Link className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'document':
      return <FileText className="w-5 h-5" />;
  }
};

export const ContentList = ({ items }: ContentListProps) => {
  if (!items.length) {
    return (
      <div className="text-center py-8 text-crimson-light">
        No content has been uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-crimson-darker p-4 rounded-lg hover:bg-crimson-dark transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{getContentIcon(item.type)}</div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-crimson-light text-sm mb-2">{item.description}</p>
              )}
              {item.url && (
                <div className="flex items-center gap-2">
                  {item.type === 'link' ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-crimson hover:text-crimson-light flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Link
                    </a>
                  ) : (
                    <a
                      href={item.url}
                      download
                      className="text-sm text-crimson hover:text-crimson-light flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download {item.type}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};