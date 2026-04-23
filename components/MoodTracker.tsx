import React from 'react';
import { Mood } from '../types';
import { playMoodClickSound } from '../utils/sound';

interface MoodTrackerProps {
  label: string;
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
}

const moodOptions: { mood: Mood; emoji: string }[] = [
  { mood: Mood.JOYFUL, emoji: '😄' },
  { mood: Mood.CHILL, emoji: '😌' },
  { mood: Mood.SAD, emoji: '😢' },
  { mood: Mood.ANGRY, emoji: '😠' },
  { mood: Mood.SILLY, emoji: '🤪' },
  { mood: Mood.TIRED, emoji: '😴' },
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({ label, selectedMood, onSelectMood }) => {
  const handleMoodSelect = (mood: Mood) => {
    playMoodClickSound();
    onSelectMood(mood);
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#C6E0C2] mb-3 text-center">{label}</h3>
      <div className="flex justify-center items-center gap-2 sm:gap-4 bg-[#000000]/20 p-3 rounded-full">
        {moodOptions.map(({ mood, emoji }) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            className={`w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-all transform focus:outline-none focus:ring-4 focus:ring-[#FF7A2F] focus:ring-opacity-50 ${
              selectedMood === mood ? 'bg-[#FF7A2F] scale-110' : 'bg-[#000000]/30 hover:bg-[#000000]/50 hover:scale-110'
            }`}
            aria-label={mood}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
