import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const icons = {
  success: <CheckCircle className="text-green-500" />,
  info: <Info className="text-blue-500" />,
  error: <XCircle className="text-red-500" />,
};

const Toast: React.FC = () => {
    const { toastMessages, removeToast } = useAppContext();

    useEffect(() => {
        if (toastMessages.length > 0) {
            toastMessages.forEach(toast => {
                // Only auto-dismiss if duration is greater than 0
                // Duration of 0 means persistent (manual dismiss only)
                if (toast.duration > 0) {
                    const timer = setTimeout(() => {
                        removeToast(toast.id);
                    }, toast.duration);
                    return () => clearTimeout(timer);
                }
            });
        }
    }, [toastMessages, removeToast]);
    
    return (
        <div className="fixed top-16 md:top-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 z-[3500] flex flex-col items-center md:items-end gap-2 w-[calc(100%-2rem)] md:w-auto max-w-md px-4 md:px-0 pointer-events-none">
            <AnimatePresence>
                {toastMessages.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`flex items-center gap-3 w-full md:w-auto md:max-w-sm p-3 rounded-xl shadow-2xl bg-stone-800/95 dark:bg-stone-800/95 backdrop-blur-xl border border-stone-700/60 pointer-events-auto ${
                            toast.duration === 0 ? 'ring-2 ring-amber-500/50' : ''
                        }`}
                    >
                        {icons[toast.type]}
                        <p className="text-sm font-medium text-stone-200 dark:text-stone-200 flex-1">{toast.message}</p>
                        <button 
                            onClick={() => removeToast(toast.id)} 
                            className="p-1 rounded-full hover:bg-stone-700/50 active:bg-stone-700/70 transition-colors flex-shrink-0" 
                            aria-label="Dismiss notification"
                        >
                             <X size={16} className="text-stone-400" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
