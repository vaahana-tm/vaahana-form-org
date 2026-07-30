import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

interface RoadProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const RoadProgressBar: React.FC<RoadProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Align with justify-between dot positions: dot i is at i/(totalSteps-1)*100%
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative w-full max-w-2xl mx-auto px-6 py-6 overflow-hidden">
      {/* Background Track */}
      <div className="h-2 bg-white/5 rounded-full relative overflow-hidden flex items-center border border-white/5 backdrop-blur-sm">
        {/* Progress Fill - Neon Glow */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500/50 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Checkpoints */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 pointer-events-none">
        {[...Array(totalSteps)].map((_, i) => (
          <motion.div 
            key={i} 
            initial={false}
            animate={{ 
              scale: i + 1 === currentStep ? 1.2 : 1,
              backgroundColor: i < currentStep ? "#3B82F6" : "rgba(255,255,255,0.1)"
            }}
            className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-white/20 transition-all duration-500",
              i < currentStep ? "shadow-[0_0_10px_#3B82F6]" : ""
            )}
          />
        ))}
      </div>

      {/* Floating Indicator - aligned with dot positions inside px-6 padding */}
      <motion.div
        className="absolute bottom-full mb-3"
        animate={{
          left: `calc(24px + (${progress} / 100) * (100% - 48px))`,
          x: progress === 100 ? '-100%' : progress === 0 ? '0%' : '-50%'
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center">
           <div className="px-2 py-0.5 md:px-3 md:py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[9px] md:text-[10px] font-bold text-white mb-1.5 md:mb-2 tracking-wider whitespace-nowrap">
            STEP {currentStep}
           </div>
           <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
             <Car size={14} className="text-white fill-white md:hidden" />
             <Car size={16} className="text-white fill-white hidden md:block" />
           </div>
        </div>
      </motion.div>
    </div>
  );
};

import { cn } from './ui';
