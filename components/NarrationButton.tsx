import React, { useState, useCallback } from 'react';
import { textToSpeech } from '../services/geminiService';
import { playNarration } from '../utils/sound';
import { SoundOnIcon } from './icons';

interface NarrationButtonProps {
  textToNarrate: string;
}

export const NarrationButton: React.FC<NarrationButtonProps> = ({ textToNarrate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNarration = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks etc.
    if (isLoading || !textToNarrate) return;

    setIsLoading(true);
    try {
      const audioData = await textToSpeech(textToNarrate);
      await playNarration(audioData);
    } catch (error) {
      console.error("Narration failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [textToNarrate, isLoading]);

  return (
    <button
      onClick={handleNarration}
      disabled={isLoading}
      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-wait shrink-0"
      aria-label="Play narration"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <SoundOnIcon className="w-5 h-5" />
      )}
    </button>
  );
};
