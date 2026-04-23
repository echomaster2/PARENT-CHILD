import React, { useState, useEffect, useCallback } from 'react';
import { Mood, Tone } from './types';
import type { ChildProfile, Guidance } from './types';
import { ProfileForm } from './components/ProfileForm';
import { MoodTracker } from './components/MoodTracker';
import { ToneSelector } from './components/ToneSelector';
import { GuidanceDisplay } from './components/GuidanceDisplay';
import { SettingsModal } from './components/SettingsModal';
import { getDailyGuidance } from './services/geminiService';
import { StarIcon, SettingsIcon } from './components/icons';
import { playGuidanceSound, stopNarration } from './utils/sound';


const App: React.FC = () => {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [parentMood, setParentMood] = useState<Mood>(Mood.CHILL);
  const [childMood, setChildMood] = useState<Mood>(Mood.CHILL);
  const [adviceTone, setAdviceTone] = useState<Tone>(Tone.FUNNY);
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('childProfile');
    if (savedProfile) {
      setChildProfile(JSON.parse(savedProfile));
    }
    const savedSoundSetting = localStorage.getItem('soundsEnabled');
    // If setting exists, use it. Otherwise, default to true.
    if (savedSoundSetting !== null) {
      setSoundsEnabled(savedSoundSetting === 'true');
    } else {
      localStorage.setItem('soundsEnabled', 'true');
      setSoundsEnabled(true);
    }
    
    // Cleanup audio on unmount
    return () => {
        stopNarration();
    }
  }, []);

  const handleProfileCreate = (profile: ChildProfile) => {
    localStorage.setItem('childProfile', JSON.stringify(profile));
    setChildProfile(profile);
  };
  
  const handleGenerateGuidance = useCallback(async () => {
    if (!childProfile) {
      setError("Please create a child profile first.");
      return;
    }

    stopNarration();
    setIsLoading(true);
    setError(null);
    setGuidance(null);

    try {
      const result = await getDailyGuidance(childProfile, parentMood, childMood, adviceTone);
      setGuidance(result);
      playGuidanceSound();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [childProfile, parentMood, childMood, adviceTone]);

  const resetProfile = () => {
    stopNarration();
    localStorage.removeItem('childProfile');
    setChildProfile(null);
    setGuidance(null);
    setError(null);
  }

  const toggleSounds = () => {
    setSoundsEnabled(prev => {
        const newState = !prev;
        localStorage.setItem('soundsEnabled', String(newState));
        if (!newState) {
            stopNarration();
        }
        return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#000000] text-[#D5CBA3] p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl relative">
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-black/20 text-[#D5CBA3] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] focus:ring-[#FF7A2F]"
                aria-label="Open settings"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>
        </div>
        <header className="text-center mb-12 pt-12 sm:pt-0">
          <div className="flex items-center justify-center gap-4">
            <StarIcon className="w-10 h-10 text-[#D5CBA3]" />
            <h1 className="text-4xl sm:text-5xl font-display text-white tracking-wider">
              Make Me the Best
            </h1>
          </div>
          <p className="text-[#C6E0C2] mt-2">Your daily cosmic cheat code to parenting.</p>
        </header>

        <main className="flex flex-col items-center justify-center">
          {!childProfile ? (
            <ProfileForm onProfileCreate={handleProfileCreate} />
          ) : (
            <div className="w-full space-y-8">
              <div className="bg-[#000000]/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-[#D5CBA3]/20 text-center">
                  <p className="text-xl text-[#C6E0C2]">
                      Ready to decode the day for <span className="font-bold text-[#FF7A2F]">{childProfile.name}?</span>
                  </p>
                  {childProfile.birthstone && (
                    <p className="text-sm text-[#D5CBA3] mt-1">
                        Birthstone: <span className="font-semibold">{childProfile.birthstone}</span>
                    </p>
                  )}
                  <button onClick={resetProfile} className="text-xs text-[#C6E0C2]/80 hover:text-[#FF7A2F] mt-2 transition">
                      Change Profile
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <MoodTracker label="How are you feeling?" selectedMood={parentMood} onSelectMood={setParentMood} />
                  <MoodTracker label={`How is ${childProfile.name} feeling?`} selectedMood={childMood} onSelectMood={setChildMood} />
              </div>
              
              <ToneSelector selectedTone={adviceTone} onSelectTone={setAdviceTone} />
              
              <div className="text-center pt-4">
                <button
                  onClick={handleGenerateGuidance}
                  disabled={isLoading}
                  className="bg-[#FF7A2F] text-black font-bold py-4 px-8 rounded-full hover:bg-[#E66A2A] transform transition-all duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Consulting the Cosmos...
                    </>
                  ) : (
                    "Get Today's Cheat Code"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-6 bg-[#FF7A2F]/20 border border-[#FF7A2F] text-[#FF7A2F]/90 px-4 py-3 rounded-lg text-center">
                  <p>{error}</p>
                </div>
              )}
              
              {guidance && (
                <div className="mt-12">
                    <GuidanceDisplay guidance={guidance} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundsEnabled={soundsEnabled}
        onToggleSounds={toggleSounds}
      />
    </div>
  );
};

export default App;
