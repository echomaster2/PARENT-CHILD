import React from 'react';
import { CloseIcon, SoundOnIcon, SoundOffIcon } from './icons';
import { playToggleSound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundsEnabled: boolean;
  onToggleSounds: () => void;
}

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => {
    const handleToggle = () => {
        playToggleSound();
        onToggle();
    };
    
    return (
        <label htmlFor="sound-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
                <input 
                    id="sound-toggle" 
                    type="checkbox" 
                    className="sr-only" 
                    checked={enabled} 
                    onChange={handleToggle} 
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-[#FF7A2F]' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
    );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, soundsEnabled, onToggleSounds }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gradient-to-br from-[#1A1A1A] to-[#000000] rounded-2xl shadow-2xl border border-[#D5CBA3]/20 w-full max-w-sm m-4 p-6 relative animate-slide-up"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
        >
            <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-display text-white text-center mb-6">Settings</h2>
        
        <div className="flex items-center justify-between bg-[#000000]/20 p-4 rounded-lg">
            <div className="flex items-center gap-3">
                {soundsEnabled ? <SoundOnIcon className="w-6 h-6 text-[#C6E0C2]" /> : <SoundOffIcon className="w-6 h-6 text-gray-500" />}
                <span className="font-semibold text-[#C6E0C2]">Sound Effects</span>
            </div>
            <ToggleSwitch enabled={soundsEnabled} onToggle={onToggleSounds} />
        </div>
      </div>
    </div>
  );
};
