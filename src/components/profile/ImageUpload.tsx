import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  type: 'profile' | 'banner';
  currentUrl?: string;
  onUpload: (url: string) => void;
}

export const ImageUpload = ({ type, currentUrl, onUpload }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadImage, loading, error } = useImageUpload();

  const dimensions = type === 'profile' ? '400x400' : '1500x500';
  const aspectRatio = type === 'profile' ? '1/1' : '3/1';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    const url = await uploadImage(file, type);
    if (url) {
      onUpload(url);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-crimson-light">
        {type === 'profile' ? 'Profile Image' : 'Banner Image'} ({dimensions})
      </label>

      <div 
        className="relative border-2 border-dashed border-crimson-dark rounded-lg overflow-hidden"
        style={{ aspectRatio }}
      >
        {(currentUrl || preview) ? (
          <div className="relative group">
            <img
              src={preview || currentUrl}
              alt={type}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setPreview(null)}
                className="p-2 bg-crimson rounded-full text-white hover:bg-crimson-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 hover:bg-crimson-darker transition-colors">
            {loading ? (
              <Loader className="w-8 h-8 animate-spin text-crimson" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-crimson mb-2" />
                <span className="text-sm text-crimson-light text-center">
                  Click to upload {type === 'profile' ? 'profile image' : 'banner'}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};