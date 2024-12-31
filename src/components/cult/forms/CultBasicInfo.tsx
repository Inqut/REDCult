import React from 'react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';

interface CultBasicInfoProps {
  formData: {
    name: string;
    bio: string;
  };
  onChange: (field: string, value: string) => void;
}

export const CultBasicInfo = ({ formData, onChange }: CultBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <Input
        label="Cult Name"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Enter your cult's name"
        required
      />
      <TextArea
        label="Manifesto"
        value={formData.bio}
        onChange={(e) => onChange('bio', e.target.value)}
        placeholder="Write your cult's manifesto..."
        required
      />
    </div>
  );
};