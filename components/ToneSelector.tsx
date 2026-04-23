
import React from 'react';
import { Tone } from '../types';

interface ToneSelectorProps {
  selectedTone: Tone;
  onSelectTone: (tone: Tone) => void;
}

const toneOptions = Object.values(Tone);

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelectTone }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#C6E0C2] mb-3 text-center">Advice Tone</h3>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
        {toneOptions.map(tone => (
          <button
            key={tone}
            onClick={() => onSelectTone(tone)}
            className={`px-4 py-2 text-sm rounded-full font-semibold transition-all w-full sm:w-auto ${
              selectedTone === tone
                ? 'bg-[#FF7A2F] text-black shadow-lg'
                : 'bg-[#D5CBA3]/10 text-[#D5CBA3] hover:bg-[#D5CBA3]/20'
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
};
