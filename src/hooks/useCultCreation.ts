import { useState } from 'react';
import { createCult } from '../services/cultService';
import { CultType } from '../types/cult';

interface CultFormData {
  name: string;
  bio: string;
  twitterHandle: string;
}

export const useCultCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CultFormData>({
    name: '',
    bio: '',
    twitterHandle: '',
  });

  const handleChange = (field: keyof CultFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (type: CultType) => {
    if (!formData.name.trim() || !formData.bio.trim()) {
      setError('Name and bio are required');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const cult = await createCult({
        type,
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        twitterHandle: formData.twitterHandle.trim() || undefined,
      });
      return cult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create cult';
      if (message.includes('can_create_cult')) {
        setError('You can only create one cult. Join other cults to expand your influence.');
      } else {
        setError(message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
};