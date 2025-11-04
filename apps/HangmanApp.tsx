import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Skull, Trophy, Puzzle } from 'lucide-react';

const WORDS = ["PYTHON", "ANALYTICS", "GEMINI", "SQL", "TABLEAU", "CAPGEMINI", "DATA", "SCIENCE", "MACHINE", "LEARNING", "REACT"];
const MAX_WRONG_GUESSES = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const HangmanApp: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

    const wrongGuesses = guessedLetters.filter(letter => !word.includes(letter));
    const isWinner = word.split('').every(letter => guessedLetters.includes(letter));
    const isLoser = wrongGuesses.length >= MAX_WRONG_GUESSES;

    const handleGuess = useCallback((letter: string) => {
        if (guessedLetters.includes(letter) || isWinner || isLoser) return;
        setGuessedLetters(prev => [...prev, letter]);
    }, [guessedLetters, isWinner, isLoser]);
    
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (ALPHABET.includes(key)) {
                handleGuess(key);
            }
        };
        document.addEventListener("keypress", handler);
        return () => document.removeEventListener("keypress", handler);
    }, [handleGuess]);

    const handleRestart = () => {
        setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setGuessedLetters([]);
    };
    
    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
        }
    };

    if (!playerName) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <Puzzle size={48} className="text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Portfolio Hangman</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">The words are related to my skills! Let's see what you know. What's your name?</p>
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()} placeholder="Your Name" className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400" />
                    <button onClick={handleNameSubmit} className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">Start Game</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900/50 p-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4">Portfolio Hangman</h2>
            
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 tracking-[0.5em] text-2xl md:text-4xl font-mono font-bold">
                {word.split('').map((letter, i) => (
                    <span key={i} className="border-b-4 border-stone-400 dark:border-stone-600 w-8 md:w-12 h-10 md:h-14 flex items-center justify-center">
                        <span className={guessedLetters.includes(letter) ? 'visible' : 'invisible'}>{letter}</span>
                    </span>
                ))}
            </div>
            
            <div className="w-full max-w-md mb-4">
                 <div className="flex flex-wrap justify-center gap-2">
                    {ALPHABET.map(letter => (
                        <button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.includes(letter)} className="w-8 h-8 md:w-10 md:h-10 text-sm md:text-base bg-stone-200 dark:bg-stone-800 rounded font-semibold disabled:opacity-30 hover:bg-amber-500 hover:text-white transition-colors">
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
            
             <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Wrong Guesses: {wrongGuesses.length} / {MAX_WRONG_GUESSES}</p>
            
            {(isWinner || isLoser) && (
                <div className="flex flex-col items-center gap-4">
                    {isWinner && <p className="text-lg font-bold text-green-500 flex items-center"><Trophy size={20} className="mr-2"/> You won, {playerName}!</p>}
                    {isLoser && <p className="text-lg font-bold text-red-500 flex items-center"><Skull size={20} className="mr-2"/> You lost! The word was "{word}".</p>}
                    <button onClick={handleRestart} className="flex items-center justify-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors">
                        <RotateCcw size={16} className="mr-2" /> Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default HangmanApp;
