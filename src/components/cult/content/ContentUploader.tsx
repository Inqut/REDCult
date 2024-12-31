import React, { useState } from 'react';
import { Upload, Link, FileText, Image, Video, Loader, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { ContentType } from '../../../types/content';
import { validateFile, validateUrl } from '../../../utils/contentValidation';
import { uploadContent, createContentItem } from '../../../services/contentService';

interface ContentUploaderProps {
  cultId: string;
  onUploadComplete: () => void;
}

export const ContentUploader = ({ cultId, onUploadComplete }: ContentUploaderProps) => {
  const [type, setType] = useState<ContentType>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let contentUrl = url;
      let metadata = {};

      if (file) {
        const validationError = validateFile(file, type);
        if (validationError) throw new Error(validationError);

        const uploadResult = await uploadContent(cultId, file, type);
        contentUrl = uploadResult.url;
        metadata = uploadResult.metadata;
      } else if (type === 'link' && !validateUrl(url)) {
        throw new Error('Invalid URL');
      }

      await createContentItem(cultId, type, {
        title,
        description,
        url: contentUrl,
        metadata,
      });

      onUploadComplete();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
  };

  const contentTypes: { type: ContentType; icon: React.ReactNode; label: string }[] = [
    { type: 'text', icon: <FileText className="w-5 h-5" />, label: 'Text' },
    { type: 'image', icon: <Image className="w-5 h-5" />, label: 'Image' },
    { type: 'video', icon: <Video className="w-5 h-5" />, label: 'Video' },
    { type: 'link', icon: <Link className="w-5 h-5" />, label: 'Link' },
    { type: 'document', icon: <FileText className="w-5 h-5" />, label: 'Document' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-6">
        {contentTypes.map(({ type: contentType, icon, label }) => (
          <button
            key={contentType}
            type="button"
            onClick={() => setType(contentType)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              type === contentType
                ? 'border-crimson bg-crimson-darker'
                : 'border-crimson-dark hover:border-crimson'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {type === 'link' ? (
        <Input
          label="URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      ) : type !== 'text' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Upload {type}</label>
          <div className="border-2 border-dashed border-crimson-dark rounded-lg p-6 hover:border-crimson transition-colors">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">
                {file ? file.name : `Click to upload ${type}`}
              </span>
            </label>
          </div>
        </div>
      ) : null}

      {error && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Content'
        )}
      </button>
    </form>
  );
};