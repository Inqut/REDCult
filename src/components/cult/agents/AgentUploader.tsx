import React, { useState } from 'react';
import { Upload, Loader, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { validateAgentConfig } from '../../../utils/agentValidation';
import { createAgent } from '../../../services/agentService';

interface AgentUploaderProps {
  cultId: string;
  onUploadComplete: () => void;
}

export const AgentUploader = ({ cultId, onUploadComplete }: AgentUploaderProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configFile) {
      setError('Please upload a configuration file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = await configFile.text();
      const parsedConfig = JSON.parse(config);
      
      const validationError = validateAgentConfig(parsedConfig);
      if (validationError) {
        throw new Error(validationError);
      }

      await createAgent(cultId, {
        name,
        description,
        model: 'llama',
        config: parsedConfig,
      });

      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Agent Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Configuration File</label>
        <div className="border-2 border-dashed border-crimson-dark rounded-lg p-6 hover:border-crimson transition-colors">
          <input
            type="file"
            accept=".json"
            onChange={(e) => setConfigFile(e.target.files?.[0] || null)}
            className="hidden"
            id="config-upload"
          />
          <label
            htmlFor="config-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">
              {configFile ? configFile.name : 'Upload character.json'}
            </span>
          </label>
        </div>
      </div>

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
            Creating Agent...
          </>
        ) : (
          'Create Agent'
        )}
      </button>
    </form>
  );
};