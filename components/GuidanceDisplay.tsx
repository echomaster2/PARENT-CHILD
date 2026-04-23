import React from 'react';
import type { Guidance } from '../types';
import { StarIcon, WandIcon, HeartIcon, LightbulbIcon } from './icons';
import { NarrationButton } from './NarrationButton';

interface GuidanceDisplayProps {
  guidance: Guidance;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    content: string;
    colorClass: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, content, colorClass }) => (
    <div className={`bg-[#000000]/20 p-4 rounded-lg border ${colorClass} backdrop-blur-sm`}>
        <div className="flex items-start justify-between mb-2 gap-2">
            <div className="flex items-center">
                {icon}
                <h4 className="font-bold text-white ml-2">{title}</h4>
            </div>
            <NarrationButton textToNarrate={`${title}. ${content}`} />
        </div>
        <p className="text-[#C6E0C2] text-sm">{content}</p>
    </div>
);

export const GuidanceDisplay: React.FC<GuidanceDisplayProps> = ({ guidance }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-gradient-to-br from-[#000000]/40 to-transparent p-6 rounded-2xl shadow-2xl border border-[#D5CBA3]/20 space-y-4">
            <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl font-display text-white">{guidance.cheatCode}</h2>
                <NarrationButton textToNarrate={guidance.cheatCode} />
            </div>
            <div className="flex justify-between items-start gap-4">
                 <p className="text-[#D5CBA3]">{guidance.explanation}</p>
                <NarrationButton textToNarrate={guidance.explanation} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
                icon={<LightbulbIcon className="w-5 h-5 text-[#D5CBA3]"/>}
                title="Parenting Tip"
                content={guidance.parentingTip}
                colorClass="border-[#D5CBA3]/30"
            />
            <InfoCard 
                icon={<HeartIcon className="w-5 h-5 text-[#FF7A2F]"/>}
                title="Snack Recommendation"
                content={guidance.snackRec}
                colorClass="border-[#FF7A2F]/30"
            />
            <InfoCard 
                icon={<WandIcon className="w-5 h-5 text-[#C6E0C2]"/>}
                title="Meltdown Decoder"
                content={guidance.meltdownDecoder}
                colorClass="border-[#C6E0C2]/30"
            />
             <InfoCard 
                icon={<StarIcon className="w-5 h-5 text-[#FF7A2F]"/>}
                title="Your Reward!"
                content={guidance.gamifiedFeedback}
                colorClass="border-[#FF7A2F]/30"
            />
        </div>
    </div>
  );
};
