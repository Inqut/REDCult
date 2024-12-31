import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CultTypeSelection } from './CultTypeSelection';
import { CultBasicInfo } from './CultBasicInfo';
import { useCultCreation } from '../../../hooks/useCultCreation';
import { CultType } from '../../../types/cult';
import { useAuth } from '../../../hooks/useAuth';

export const CultCreationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [cultType, setCultType] = useState<CultType>('agent');
  const { formData, loading, error, handleChange, handleSubmit } = useCultCreation();

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth', { 
        state: { returnTo: '/cultcreation' }
      });
      return;
    }

    try {
      const cult = await handleSubmit(cultType);
      if (cult) {
        navigate(`/cults/${cult.id}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="mb-4">You must be logged in to create a cult</p>
        <button
          onClick={() => navigate('/auth', { 
            state: { returnTo: '/cultcreation' }
          })}
          className="bg-crimson text-white px-6 py-3 rounded-lg hover:bg-crimson-light transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Create Your Cult</h2>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {step === 1 ? (
          <>
            <CultTypeSelection selected={cultType} onSelect={setCultType} />
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <CultBasicInfo formData={formData} onChange={handleChange} />
            
            {error && (
              <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 border-2 border-crimson-dark p-3 rounded-lg hover:border-crimson transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Cult'
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};