import React, { useState, useEffect } from 'react';
import { RotateCcw, HelpCircle, Target } from 'lucide-react';

const GuessTheNumberApp: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState("I've thought of a number between 1 and 100. Can you guess it?");
    const [guesses, setGuesses] = useState<number[]>([]);
    const [isWon, setIsWon] = useState(false);
    
    const handleGuess = () => {
        const numGuess = parseInt(guess);
        if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
            setFeedback("Please enter a valid number between 1 and 100.");
            return;
        }

        setGuesses(prev => [...prev, numGuess]);
        setGuess('');

        if (numGuess === secretNumber) {
            setFeedback(`You got it in ${guesses.length + 1} guesses! The number was ${secretNumber}.`);
            setIsWon(true);
        } else if (numGuess < secretNumber) {
            setFeedback(`Too low! Try a higher number.`);
        } else {
            setFeedback(`Too high! Try a lower number.`);
        }
    };

    const handleRestart = () => {
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setFeedback("New game! I've thought of a new number between 1 and 100.");
        setGuesses([]);
        setIsWon(false);
    };
    
    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
        }
    };
    
    if (!playerName) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <HelpCircle size={48} className="text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Welcome, Mind Reader!</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">Let's play 'Guess the Number'. What should I call you?</p>
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()} placeholder="Your Name" className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400" />
                    <button onClick={handleNameSubmit} className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">Let's Go!</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900/50 p-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">Guess the Number</h2>
            <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 mb-4 min-h-[2rem]">{feedback}</p>

            <div className="w-full max-w-xs flex flex-col gap-3 mb-4">
                <input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder="Your guess"
                    className="w-full text-center bg-stone-200 dark:bg-stone-800 text-lg p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                    disabled={isWon}
                />
                {!isWon ? (
                    <button onClick={handleGuess} className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                        Submit Guess
                    </button>
                ) : (
                    <button onClick={handleRestart} className="flex items-center justify-center p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                         <RotateCcw size={16} className="mr-2" /> Play Again
                    </button>
                )}
            </div>

            <div className="w-full max-w-xs">
                <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Previous Guesses: {guesses.length}</h3>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    {guesses.map((g, i) => <span key={i} className="bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded-full">{g}</span>)}
                </div>
            </div>
        </div>
    );
};

export default GuessTheNumberApp;
