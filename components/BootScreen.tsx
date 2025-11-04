import React from 'react';
import { motion } from 'framer-motion';
import { Aperture } from 'lucide-react';

const BootScreen: React.FC = () => {
    return (
        <div className="w-screen h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="mb-8"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <Aperture className="w-24 h-24 text-amber-500" />
                </motion.div>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-4 text-lg font-light tracking-widest"
            >
                PORTFOLIO OS
            </motion.p>
            <div className="w-64 bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    className="bg-amber-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

export default BootScreen;