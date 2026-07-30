import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Questionnaire } from './components/Questionnaire'

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="relative min-h-screen w-full selection:bg-blue-100 font-inter">
      {/* Cinematic Video Background - Fixed */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover scale-[1.02]"
        >
          <source src="/mov.mp4" type="video/mp4" />
        </video>
        {/* Deep Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 backdrop-brightness-50" />
      </div>

      {/* Branding Header – mobile-first */}
      <header className="fixed top-0 left-0 right-0 z-[5] px-6 py-4 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 md:gap-4 pointer-events-auto"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10">
            <span className="text-slate-900 font-poppins font-black text-lg md:text-2xl">V</span>
          </div>
          <span className="text-2xl md:text-3xl font-poppins font-black text-white tracking-tighter">
            VAAHANA
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-4 items-center pointer-events-auto"
        >
          <div className="px-6 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">
            REGISTRATION STAGE 01
          </div>
        </motion.div>
      </header>

      {/* Questionnaire Content Area - Standard Scroll */}
      <main className="relative z-10 w-full min-h-screen pt-36 pb-20 md:pt-40 md:pb-32 px-4 flex justify-center items-start">
        <div className="w-full max-w-4xl">
          <Questionnaire currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>
      </main>
    </div>
  )
}

export default App
