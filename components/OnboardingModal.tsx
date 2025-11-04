import React from 'react';
import { motion } from 'framer-motion';
import { Cat } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const OnboardingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { setIsGuiding } = useAppContext();

    const handleStartTour = () => {
        setIsGuiding(true);
        onClose();
    };

    const handleSkipTour = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[4000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-100 dark:bg-stone-900 rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-stone-300/50 dark:border-stone-700/50"
            >
                <Cat size={48} className="mx-auto text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Welcome to My Portfolio OS!</h2>
                <p className="text-stone-600 dark:text-stone-400 mb-6">
                    Would you like a quick tour with my AI assistant to show you around?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSkipTour}
                        className="flex-1 px-6 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold rounded-lg shadow-md hover:bg-stone-300 dark:hover:bg-stone-700 transition-all duration-200"
                    >
                        No, thanks
                    </button>
                    <button
                        onClick={handleStartTour}
                        className="flex-1 px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200"
                    >
                        Yes, please!
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;