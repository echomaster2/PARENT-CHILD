import React, { useState, useEffect } from 'react';
import type { ChildProfile } from '../types';
import { getBirthstone } from '../utils/astrology';
import { playProfileSaveSound } from '../utils/sound';

interface ProfileFormProps {
  onProfileCreate: (profile: ChildProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileCreate }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [birthstone, setBirthstone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (dob) {
        setBirthstone(getBirthstone(dob));
    } else {
        setBirthstone('');
    }
  }, [dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    playProfileSaveSound();
    onProfileCreate({ name, dob, birthstone });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#000000]/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-[#D5CBA3]/20">
      <h2 className="text-3xl font-display text-white text-center mb-2">Create Child Profile</h2>
      <p className="text-center text-[#C6E0C2] mb-8">Let's get to know your little star.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#C6E0C2] mb-1">
            Child's Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Fairway"
            className="w-full px-4 py-2 bg-[#000000]/30 text-white border border-[#C6E0C2]/50 rounded-lg focus:ring-2 focus:ring-[#FF7A2F] focus:border-[#FF7A2F] outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-[#C6E0C2] mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 bg-[#000000]/30 text-white border border-[#C6E0C2]/50 rounded-lg focus:ring-2 focus:ring-[#FF7A2F] focus:border-[#FF7A2F] outline-none transition-all appearance-none"
          />
        </div>
        <div>
          <label htmlFor="birthstone" className="block text-sm font-medium text-[#C6E0C2] mb-1">
            Birthstone
          </label>
          <input
            type="text"
            id="birthstone"
            value={birthstone}
            readOnly
            placeholder="Select a date to see"
            className="w-full px-4 py-2 bg-[#000000]/50 text-[#D5CBA3] border border-[#C6E0C2]/30 rounded-lg outline-none cursor-default"
          />
        </div>
        {error && <p className="text-[#FF7A2F]/90 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#FF7A2F] text-black font-bold py-3 px-4 rounded-lg hover:bg-[#E66A2A] focus:outline-none focus:ring-4 focus:ring-[#FF7A2F] focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};
