import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Bot, Pizza, Heart } from 'lucide-react';
import { motion, useAnimation, AnimatePresence, useDragControls } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

// Constants
const TIPS = [
    "Tip: Try the Terminal app! *meow*",
    "Tip: You can change the theme in Settings!",
    "Tip: Try unlocking secrets with the Konami code! 🤫",
    "Tip: Check out my projects in the Projects app!",
    "Tip: The desktop icons are draggable!",
    "Tip: Right-click the desktop for quick options.",
    "Tip: I can see you! My eyes follow your cursor when I'm idle.",
    "Tip: Curious about my work style? Open the 'Work With Me' app!",
    "Tip: Type 'matrix' in the Terminal for a surprise!",
    "Tip: Type 'hire me now' in the Terminal for confetti!",
    "Tip: Triple-click me for a special move!",
    "Tip: Click 'Tanmay Kalbande' in the menubar 10 times... if you dare! 😉"
];

type Mood = 'idle' | 'walking' | 'surprised' | 'sleepy' | 'sleeping' | 'happy' | 'celebrating' | 'curious' | 'playful' | 'backflipping';

const CatIconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
    <div className="relative group">
        <button onClick={onClick} className="p-1 rounded-full hover:bg-stone-300/50 dark:hover:bg-stone-700/50 transition-colors">{children}</button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
        </div>
    </div>
);

interface DesktopPetProps {
    isDoingBackflip: boolean;
}

const WalkingCat: React.FC<DesktopPetProps> = ({ isDoingBackflip }) => {
  const { openWindow, windows, clickCount, isGuiding, setIsGuiding, setPetDoingBackflip, addNotification, toast } = useAppContext();
  const { isMobile } = useWindowSize(); // Added for the requested change
  const controls = useAnimation();
  const dragControls = useDragControls();
  
  // Cat animation state
  const [direction, setDirection] = useState('right');
  const [mood, setMood] = useState<Mood>('idle');
  const moodRef = useRef(mood);
  moodRef.current = mood;
  const [isDragging, setIsDragging] = useState(false);
  const [sleepBreathFrame, setSleepBreathFrame] = useState(0);
  const [walkFrame, setWalkFrame] = useState(0);
  const catRef = useRef<HTMLDivElement>(null);
  const actionTimeoutRef = useRef<number | null>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  // UI state
  const [happiness, setHappiness] = useState(0);
  const [message, setMessage] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const isBubbleVisibleRef = useRef(isBubbleVisible);
  isBubbleVisibleRef.current = isBubbleVisible;
  const bubbleTimeoutRef = useRef<number | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [hasShownHappinessToast, setHasShownHappinessToast] = useState(false);
  const shuffledTips = useRef<string[]>([]);

  // Guided Tour and Responsive State
  const [guideStep, setGuideStep] = useState(0);
  const [desktopBounds, setDesktopBounds] = useState(() => ({ 
    top: 50, 
    left: 50, 
    right: window.innerWidth - 150, 
    bottom: window.innerHeight - 250 
  }));
  const [tourSteps, setTourSteps] = useState(() => [
      { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "Welcome! I'm your AI guide. Let's explore the Portfolio OS together. Click 'Next' to continue." },
      { x: 150, y: 150, message: "This is your desktop. You can open apps by double-clicking the icons here." },
      { x: window.innerWidth / 2 - 60, y: window.innerHeight - 200, message: "Down here is the dock. It holds your most-used applications for quick access." },
      { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "When you open an app, it appears in a window. You can drag, minimize, and close them." },
      { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "That's it! Feel free to explore. You can right-click the desktop for more options. Enjoy!" },
  ]);

  // Triple-click for backflip
  const clickTimerRef = useRef<number | null>(null);
  const clickCountRef = useRef(0);
  
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (isGuiding || mood === 'backflipping') return;
        e.stopPropagation();

        if (mood === 'sleeping' || mood === 'sleepy') {
            if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
            controls.stop();
            setMood('surprised');
            setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 1000);
        } else {
            if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
            controls.stop();
            setMood('happy');
            setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 800);
        }
    };

  const handlePetClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    clickCountRef.current++;
    if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current === 3) {
        if (!isGuiding && moodRef.current !== 'backflipping') {
            setPetDoingBackflip(true);
            setMood('backflipping');
            addNotification({ icon: Heart, title: 'Pet Delight!', message: 'Your pet just did a backflip! Amazing!' });
            toast('Woah! A backflip!', 'info');
            setTimeout(() => {
                setPetDoingBackflip(false);
                setMood('happy');
                setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 1000);
            }, 1000);
        }
        clickCountRef.current = 0;
    } else {
        clickTimerRef.current = window.setTimeout(() => {
            if (clickCountRef.current === 1) {
                 handleTap(e);
            }
            clickCountRef.current = 0;
        }, 300);
    }
  };

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
        setDesktopBounds({ 
            top: 50, 
            left: 50, 
            right: window.innerWidth - 150, 
            bottom: window.innerHeight - 250 
        });
        setTourSteps([
            { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "Welcome! I'm your AI guide. Let's explore the Portfolio OS together. Click 'Next' to continue." },
            { x: 150, y: 150, message: "This is your desktop. You can open apps by double-clicking the icons here." },
            { x: window.innerWidth / 2 - 60, y: window.innerHeight - 200, message: "Down here is the dock. It holds your most-used applications for quick access." },
            { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "When you open an app, it appears in a window. You can drag, minimize, and close them." },
            { x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 100, message: "That's it! Feel free to explore. You can right-click the desktop for more options. Enjoy!" },
        ]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const showMessage = useCallback((newMessage: string, duration = 4000) => {
    if (isGuiding) return;
    setMessage(newMessage);
    setIsBubbleVisible(true);
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    bubbleTimeoutRef.current = window.setTimeout(() => {
      setIsBubbleVisible(false);
    }, duration);
  }, [isGuiding]);

  const getNextTip = useCallback(() => {
    if (shuffledTips.current.length === 0) {
        shuffledTips.current = [...TIPS].sort(() => Math.random() - 0.5);
    }
    return shuffledTips.current.pop() || "That's all the tips I have for now!";
  }, []);


  // State machine for actions
  useEffect(() => {
    const decideNextAction = () => {
        if (isGuiding || isDragging || moodRef.current === 'playful' || moodRef.current === 'surprised' || moodRef.current === 'curious' || moodRef.current === 'backflipping') return;

        const performWalk = () => {
            setMood('walking');
            
            // Get current position from the animation controls, not the ref
            const currentX = (controls as any)._values?.x || 100;
            const currentY = (controls as any)._values?.y || window.innerHeight - 250;
            
            const targetX = Math.random() * (desktopBounds.right - desktopBounds.left) + desktopBounds.left;
            const targetY = Math.random() * (desktopBounds.bottom - desktopBounds.top) + desktopBounds.top;
            
            setDirection(targetX > currentX ? 'right' : 'left');
            
            controls.start({ 
                x: targetX, 
                y: targetY, 
                transition: { duration: 5 + Math.random() * 5, ease: 'linear' } 
            }).then(() => {
                if (moodRef.current === 'walking') {
                    setMood(hasCelebrated ? 'happy' : 'idle');
                }
            });
        };

        if (hasCelebrated) {
            if (Math.random() > 0.1) {
                performWalk();
            } else {
                setMood('happy');
            }
            return;
        }

        const nextAction = Math.random();
        if (nextAction > 0.3) {
            performWalk();
        } else if (nextAction > 0.1) {
            setMood('sleepy');
            setTimeout(() => setMood('sleeping'), 2000);
        } else {
            setMood('idle');
        }
    };
    
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    if ((mood === 'idle' || mood === 'happy' || mood === 'curious') && !isGuiding) {
        actionTimeoutRef.current = window.setTimeout(decideNextAction, 5000 + Math.random() * 5000);
    }
    return () => { if(actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current) };
  }, [mood, controls, isGuiding, isDragging, desktopBounds, hasCelebrated]);

  // Animation frame timers
  useEffect(() => {
    let interval: number | undefined;
    if (mood === 'sleeping') {
      interval = window.setInterval(() => setSleepBreathFrame(prev => (prev + 1) % 60), 50);
    } else if (mood === 'walking' && !isDragging) {
      interval = window.setInterval(() => setWalkFrame(prev => (prev + 1) % 4), 150);
    }
    return () => clearInterval(interval);
  }, [mood, isDragging]);
  
  const startDrag = (event: React.PointerEvent) => {
      if (isGuiding || mood === 'backflipping') return;
      event.stopPropagation();
      dragControls.start(event);
  };
    
  // Effect for initial greeting, random tips, and happiness gain
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
        if (!isGuiding) showMessage("*purr* Hello! I'm your guide.");
    }, 3000);

    const tipInterval = setInterval(() => {
        if (!isBubbleVisibleRef.current && moodRef.current === 'idle' && Math.random() > 0.5 && !isGuiding) {
            showMessage(getNextTip());
        }
    }, 15000);

    const happinessInterval = setInterval(() => {
        if (!hasCelebrated) setHappiness(prev => Math.min(100, prev + 1));
    }, 5000);
    
    return () => {
        clearTimeout(initialTimeout);
        clearInterval(tipInterval);
        clearInterval(happinessInterval);
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, [hasCelebrated, showMessage, getNextTip, isGuiding]);

  
  // Smarter Reactions
  const isIdle = !isDragging && mood !== 'walking' && mood !== 'sleeping' && mood !== 'playful' && mood !== 'sleepy' && mood !== 'backflipping';
  const openWindowsCount = useRef(Object.values(windows).filter(w => w.isOpen).length);
  const lastClickCount = useRef(clickCount);
  
  useEffect(() => {
    if (isGuiding || mood === 'backflipping') return;
    const currentOpenWindows = Object.values(windows).filter(w => w.isOpen).length;
    if (currentOpenWindows > openWindowsCount.current && isIdle) {
        controls.stop();
        if(actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
        const lastOpenedWindow = Object.values(windows).find(w => w.isOpen && w.zIndex === Math.max(...Object.values(windows).map(win => win.zIndex)));
        showMessage(`Ooh, the ${lastOpenedWindow?.title} app!`);
        setMood('curious');
        setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 4000);
    }
    openWindowsCount.current = currentOpenWindows;
    
    if (clickCount > lastClickCount.current + 5 && isIdle) {
        controls.stop();
        if(actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
        showMessage("So much to see!");
        setMood('playful');
        setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 3000);
    }
    lastClickCount.current = clickCount;

  }, [windows, clickCount, isIdle, showMessage, controls, isGuiding, hasCelebrated, mood]);

  // 100% Happiness Celebration
  useEffect(() => {
    if (happiness >= 100 && !hasCelebrated) {
        setHasCelebrated(true);
        showMessage("🎉 100% Happiness! Thanks for hanging out! 🎉", 5000);
        setMood('celebrating');
        setTimeout(() => {
            setMood('happy');
        }, 5000);
    }
  }, [happiness, hasCelebrated, showMessage]);

  // Happiness Toast Notification
  useEffect(() => {
    if (happiness >= 50 && !hasShownHappinessToast && !hasCelebrated) {
      toast("Try to make the cat happy!", "info");
      setHasShownHappinessToast(true);
    }
  }, [happiness, hasShownHappinessToast, hasCelebrated, toast]);

  // Eye following logic
  useEffect(() => {
    const canFollowMouse = ['idle', 'happy', 'curious', 'playful', 'celebrating'].includes(mood) && !isDragging && !moodRef.current.includes('sleep') && moodRef.current !== 'surprised';

    if (canFollowMouse) {
        const handleMouseMove = (e: MouseEvent) => {
            if (catRef.current) {
                const rect = catRef.current.getBoundingClientRect();
                const headCenterX = rect.left + rect.width / 2;
                const headCenterY = rect.top + rect.height * 0.4;
                
                const dx = e.clientX - headCenterX;
                const dy = e.clientY - headCenterY;
                const angle = Math.atan2(dy, dx);
                
                const maxOffset = 2;
                const offsetX = Math.cos(angle) * maxOffset;
                const offsetY = Math.sin(angle) * maxOffset;
                setPupilOffset({ x: offsetX, y: offsetY });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
        setPupilOffset({ x: 0, y: 0 });
    }
  }, [mood, isDragging, hasCelebrated]);


  const handleFeed = () => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    controls.stop();
    const happinessBoost = Math.floor(Math.random() * 3) + 2;
    setHappiness(prev => Math.min(100, prev + happinessBoost));
    showMessage(`Yum, data snacks! +${happinessBoost} happiness.`, 3000);
    setMood('playful');
    setTimeout(() => setMood(hasCelebrated ? 'happy' : 'idle'), 2000);
  };
  
  // Guided Tour Logic
  useEffect(() => {
      if (isGuiding) {
          setGuideStep(1);
      } else {
          setGuideStep(0);
      }
  }, [isGuiding]);

  useEffect(() => {
      if (isGuiding && guideStep > 0) {
          const currentStep = tourSteps[guideStep - 1];
          if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
          controls.stop();
          setMood('walking');

          // Get current position from animation controls
          const currentX = (controls as any)._values?.x || 100;
          setDirection(currentStep.x > currentX ? 'right' : 'left');

          controls.start({
              x: currentStep.x,
              y: currentStep.y,
              transition: { duration: 3, ease: 'easeInOut' }
          }).then(() => {
              setMood('happy');
              setMessage(currentStep.message);
              setIsBubbleVisible(true);
          });
      }
  }, [isGuiding, guideStep, controls, tourSteps]);

  const handleNextStep = () => {
      if (guideStep < tourSteps.length) {
          setGuideStep(s => s + 1);
      } else {
          setIsBubbleVisible(false);
          setIsGuiding(false);
          setMood('idle');
      }
  };

  const handleEndTour = () => {
      setIsBubbleVisible(false);
      setIsGuiding(false);
      setMood('idle');
  };

  // SVG calculations
  const getLegOffset = (legIndex: number) => {
    if (mood !== 'walking') return 0;
    const cycle = walkFrame / 4;
    const phase = (cycle + legIndex * 0.5) % 1;
    return Math.sin(phase * Math.PI * 2) * 4;
  };
  
  const getBodyBounce = () => {
    if (mood === 'sleeping') return Math.sin(sleepBreathFrame * Math.PI / 30) * 1.5;
    if (mood === 'walking') return Math.abs(Math.sin(walkFrame * Math.PI / 2)) * 2;
    return 0;
  };

  const getSleepingTransform = () => {
    if (mood === 'sleeping') return { bodyY: 10, headY: 5 };
    return { bodyY: 0, headY: 0 };
  };

  const sleepTransform = getSleepingTransform();

  const renderEyes = () => {
    if (mood === 'sleepy' || mood === 'sleeping') {
      return (
        <g>
          <path d="M 45 48 Q 50 50 55 48" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 65 48 Q 70 50 75 48" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    } else if (mood === 'surprised') {
      return (
        <g>
          <circle cx="50" cy="48" r="6" fill="white" />
          <circle cx="50" cy="48" r="3" fill="black" />
          <circle cx="70" cy="48" r="6" fill="white" />
          <circle cx="70" cy="48" r="3" fill="black" />
        </g>
      );
    } else {
      return (
        <g>
          <ellipse cx="50" cy="48" rx="5" ry="7" fill="white" />
          <ellipse cx={50 + pupilOffset.x} cy={48 + pupilOffset.y} rx="2" ry="3" fill="black" />
          <ellipse cx="70" cy="48" rx="5" ry="7" fill="white" />
          <ellipse cx={70 + pupilOffset.x} cy={48 + pupilOffset.y} rx="2" ry="3" fill="black" />
        </g>
      );
    }
  };

  const happinessColor = happiness > 70 ? 'bg-green-500' : happiness > 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <motion.div
        className="fixed z-50 flex flex-col items-center pointer-events-auto"
        initial={{ x: 100, y: window.innerHeight - 250 }}
        animate={controls}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragConstraints={desktopBounds}
        style={{ touchAction: 'none' }}
        onDragStart={() => {
            if (isGuiding || mood === 'backflipping') return;
            controls.stop();
            if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
            setIsDragging(true);
            setMood('surprised');
        }}
        onDragEnd={() => {
            setIsDragging(false);
            setTimeout(() => {
                setMood(hasCelebrated ? 'happy' : 'idle');
            }, 1000);
        }}
    >
        {/* Speech Bubble */}
        <AnimatePresence>
        {isBubbleVisible && !isMobile && ( // Check if not mobile
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative mb-2 w-48 bg-stone-200/80 dark:bg-stone-800/80 backdrop-blur-lg p-3 rounded-xl border border-stone-300/50 dark:border-stone-700/50 shadow-lg text-stone-800 dark:text-stone-200"
            >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-inherit border-b border-r border-stone-300/50 dark:border-stone-700/50 transform rotate-45 -z-10"></div>
            <p className="text-xs text-center text-stone-600 dark:text-stone-400 min-h-[2.5rem] flex items-center justify-center">{message}</p>
            {!isGuiding ? (
                <>
                    <div className="my-2">
                        <div className="w-full bg-stone-300 dark:bg-stone-700 rounded-full h-1.5">
                            <motion.div className={`${happinessColor} h-1.5 rounded-full`} initial={{ width: 0 }} animate={{ width: `${happiness}%` }} transition={{ duration: 0.5 }}></motion.div>
                        </div>
                    </div>
                    <div className="flex justify-around items-center mt-2">
                        <CatIconButton label="Feed Me" onClick={handleFeed}><Pizza size={18} /></CatIconButton>
                        <CatIconButton label="Play a Game" onClick={() => openWindow('games_folder')}><Gamepad2 size={18} /></CatIconButton>
                        <CatIconButton label="Ask AI" onClick={() => openWindow('ai_assistant')}><Bot size={18} /></CatIconButton>
                    </div>
                </>
            ) : (
                <div className="flex gap-2 mt-2">
                    <button onClick={handleEndTour} className="text-xs flex-1 py-1 rounded bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-600">End Tour</button>
                    <button onClick={handleNextStep} className="text-xs flex-1 py-1 rounded bg-amber-500 text-white hover:bg-amber-600">{guideStep >= tourSteps.length ? 'Finish' : 'Next'}</button>
                </div>
            )}
            </motion.div>
        )}
        </AnimatePresence>

        {/* Cat SVG */}
        <motion.div
            ref={catRef}
            style={{ 
                transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                animation: mood === 'playful' ? 'hop 1s ease-in-out' : (isDoingBackflip ? 'backflip 1s ease-in-out' : 'none'),
                touchAction: 'none',
            }}
            className="w-24 h-24 cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
            onPointerDown={startDrag}
            onClick={handlePetClick}
            onTouchStart={handlePetClick}
        >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
          <ellipse cx="60" cy="105" rx="30" ry="6" fill="rgba(0, 0, 0, 0.3)" />
          
          <path
            d={mood === 'sleeping' ? "M 85 75 Q 95 75 100 70" : "M 85 65 Q 105 55 100 35"}
            stroke="#292524" strokeWidth="8" fill="none" strokeLinecap="round"
            style={{
              animation: (mood === 'walking' || mood === 'celebrating' || mood === 'playful') ? 'tailWag 0.6s ease-in-out infinite' : 'none',
              transition: 'all 0.5s ease'
            }}
          />
          
          <g transform={`translate(0, ${getLegOffset(0) + sleepTransform.bodyY})`} style={{ opacity: mood === 'sleeping' ? 0 : 1, transition: 'opacity 0.5s' }}>
            <rect x="70" y="80" width="6" height="18" rx="3" fill="#292524" />
            <ellipse cx="73" cy="98" rx="7" ry="4" fill="#1c1917" />
          </g>
          
          <g transform={`translate(0, ${getLegOffset(1) + sleepTransform.bodyY})`} style={{ opacity: mood === 'sleeping' ? 0 : 1, transition: 'opacity 0.5s' }}>
            <rect x="58" y="80" width="6" height="18" rx="3" fill="#292524" />
            <ellipse cx="61" cy="98" rx="7" ry="4" fill="#1c1917" />
          </g>
          
          <ellipse cx="60" cy={70 - getBodyBounce() + sleepTransform.bodyY} rx={mood === 'sleeping' ? 32 : 28} ry={mood === 'sleeping' ? 18 : 22} fill="#1c1917" style={{ transition: 'all 0.5s ease' }}/>
          <ellipse cx="60" cy={68 - getBodyBounce() + sleepTransform.bodyY} rx={mood === 'sleeping' ? 28 : 24} ry={mood === 'sleeping' ? 14 : 16} fill="#292524" opacity="0.5" style={{ transition: 'all 0.5s ease' }} />
          
          <g transform={`translate(0, ${getLegOffset(2) + sleepTransform.bodyY})`} style={{ opacity: mood === 'sleeping' ? 0 : 1, transition: 'opacity 0.5s' }}>
            <rect x="44" y="80" width="6" height="18" rx="3" fill="#292524" />
            <ellipse cx="47" cy="98" rx="7" ry="4" fill="#1c1917" />
          </g>
          
          <g transform={`translate(0, ${getLegOffset(3) + sleepTransform.bodyY})`} style={{ opacity: mood === 'sleeping' ? 0 : 1, transition: 'opacity 0.5s' }}>
            <rect x="32" y="80" width="6" height="18" rx="3" fill="#292524" />
            <ellipse cx="35" cy="98" rx="7" ry="4" fill="#1c1917" />
          </g>
          
          <circle cx="60" cy={50 - getBodyBounce() + sleepTransform.headY} r="26" fill="#1c1917" style={{ transition: 'all 0.5s ease' }} />
          <circle cx="60" cy={48 - getBodyBounce() + sleepTransform.headY} r="22" fill="#292524" opacity="0.4" style={{ transition: 'all 0.5s ease' }} />
          
          <path d={`M 42 ${32 - getBodyBounce() + sleepTransform.headY} L 35 ${15 - getBodyBounce() + sleepTransform.headY} L 48 ${28 - getBodyBounce() + sleepTransform.headY} Z`} fill="#1c1917" style={{ transition: 'all 0.5s ease' }} />
          <path d={`M 42 ${32 - getBodyBounce() + sleepTransform.headY} L 38 ${22 - getBodyBounce() + sleepTransform.headY} L 46 ${30 - getBodyBounce() + sleepTransform.headY} Z`} fill="#44403c" style={{ transition: 'all 0.5s ease' }} />
          
          <path d={`M 78 ${32 - getBodyBounce() + sleepTransform.headY} L 85 ${15 - getBodyBounce() + sleepTransform.headY} L 72 ${28 - getBodyBounce() + sleepTransform.headY} Z`} fill="#1c1917" style={{ transition: 'all 0.5s ease' }} />
          <path d={`M 78 ${32 - getBodyBounce() + sleepTransform.headY} L 82 ${22 - getBodyBounce() + sleepTransform.headY} L 74 ${30 - getBodyBounce() + sleepTransform.headY} Z`} fill="#44403c" style={{ transition: 'all 0.5s ease' }} />
          
          <g transform={`translate(0, ${-getBodyBounce() + sleepTransform.headY})`}>{renderEyes()}</g>
          
          <path d={`M 60 ${54 - getBodyBounce() + sleepTransform.headY} L 57 ${57 - getBodyBounce() + sleepTransform.headY} L 63 ${57 - getBodyBounce() + sleepTransform.headY} Z`} fill="#78716c" style={{ transition: 'all 0.5s ease' }} />
          <path
            d={
              hasCelebrated ? `M 55 ${60 - getBodyBounce() + sleepTransform.headY} Q 60 ${65 - getBodyBounce() + sleepTransform.headY} 65 ${60 - getBodyBounce() + sleepTransform.headY}` :
              mood === 'surprised'
              ? `M 60 ${57 - getBodyBounce() + sleepTransform.headY} Q 60 ${63 - getBodyBounce() + sleepTransform.headY} 60 ${63 - getBodyBounce() + sleepTransform.headY}`
              : `M 60 ${57 - getBodyBounce() + sleepTransform.headY} Q 54 ${62 - getBodyBounce() + sleepTransform.headY} 50 ${60 - getBodyBounce() + sleepTransform.headY} M 60 ${57 - getBodyBounce() + sleepTransform.headY} Q 66 ${62 - getBodyBounce() + sleepTransform.headY} 70 ${60 - getBodyBounce() + sleepTransform.headY}`
            }
            stroke="#78716c" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ transition: 'all 0.5s ease' }}
          />
          
          <g opacity="0.8" transform={`translate(0, ${-getBodyBounce() + sleepTransform.headY})`}>
            <path d="M 38 50 L 20 48" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <path d="M 38 54 L 18 54" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <path d="M 38 58 L 20 60" stroke="white" strokeWidth="1" strokeLinecap="round" />
            
            <path d="M 82 50 L 100 48" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <path d="M 82 54 L 102 54" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <path d="M 82 58 L 100 60" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </g>
          
          {mood === 'sleeping' && (
            <g className="animate-float">
              <text x="85" y="30" fill="#78716c" fontSize="12" opacity="0.7">Z</text>
              <text x="95" y="22" fill="#78716c" fontSize="10" opacity="0.5">z</text>
              <text x="90" y="15" fill="#78716c" fontSize="8" opacity="0.3">z</text>
            </g>
          )}
        </svg>

        {mood === 'surprised' && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-surprise">❗</div>
        )}
        </motion.div>
    </motion.div>
  );
};


const DesktopPet: React.FC<DesktopPetProps> = ({ isDoingBackflip }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[99]">
             <WalkingCat isDoingBackflip={isDoingBackflip} />
        </div>
    );
};

export default DesktopPet;
