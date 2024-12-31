import React, { useState } from 'react';
import { CultType } from '../../types/cult';
import { createCult } from '../../services/cultService';

interface ManualCultFormProps {
  cultType: CultType;
}

export const ManualCultForm = ({ cultType }: ManualCultFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    twitterHandle: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCult({
        type: cultType,
        ...formData,
      });
      // Handle successful creation
    } catch (error) {
      // Handle error
      console.error('Failed to create cult:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none h-32"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Twitter Handle (optional)</label>
        <input
          type="text"
          value={formData.twitterHandle}
          onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
          className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
          placeholder="@handle"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-crimson text-white py-3 rounded-lg hover:bg-crimson-light transition-colors"
      >
        Create Cult
      </button>
    </form>
  );
};