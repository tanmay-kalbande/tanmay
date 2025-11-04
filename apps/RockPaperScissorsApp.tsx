import React, { useState } from 'react';
import { Hand, Scissors, FileText, RotateCcw, Swords } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';
const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

const ICONS: Record<Choice, React.ReactNode> = {
    rock: <Hand size={32} />,
    paper: <FileText size={32} />,
    scissors: <Scissors size={32} />,
};

const getWinner = (playerChoice: Choice, aiChoice: Choice): 'player' | 'ai' | 'draw' => {
    if (playerChoice === aiChoice) return 'draw';
    if (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'scissors' && aiChoice === 'paper') ||
        (playerChoice === 'paper' && aiChoice === 'rock')
    ) {
        return 'player';
    }
    return 'ai';
};

const RockPaperScissorsApp: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [aiChoice, setAiChoice] = useState<Choice | null>(null);
    const [status, setStatus] = useState("Choose your weapon!");
    const [roundOver, setRoundOver] = useState(false);

    const messages = {
        start: "First to 3 wins. Good luck!",
        playerWin: ["You got lucky!", "A worthy move.", "Okay, you win this round..."],
        aiWin: ["Too easy! 😉", "As expected.", "Better luck next time!"],
        draw: ["Great minds think alike.", "A draw! Let's go again.", "A stalemate."]
    };

    const handlePlayerChoice = (choice: Choice) => {
        if (roundOver) return;

        const aiChosen = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        setPlayerChoice(choice);
        setAiChoice(aiChosen);

        const winner = getWinner(choice, aiChosen);

        if (winner === 'player') {
            setPlayerScore(s => s + 1);
            setStatus(messages.playerWin[Math.floor(Math.random() * messages.playerWin.length)]);
        } else if (winner === 'ai') {
            setAiScore(s => s + 1);
            setStatus(messages.aiWin[Math.floor(Math.random() * messages.aiWin.length)]);
        } else {
            setStatus(messages.draw[Math.floor(Math.random() * messages.draw.length)]);
        }
        setRoundOver(true);
    };

    const handleNextRound = () => {
        if (playerScore >= 3 || aiScore >= 3) {
            // Full reset
            setPlayerScore(0);
            setAiScore(0);
            setStatus("Let's play again! First to 3.");
        } else {
            setStatus("Choose your weapon!");
        }
        setPlayerChoice(null);
        setAiChoice(null);
        setRoundOver(false);
    };

    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
            setStatus(messages.start);
        }
    };

    const gameWinner = playerScore >= 3 ? playerName : aiScore >= 3 ? 'Tanmay' : null;

    if (!playerName) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <Swords size={48} className="text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Another challenger!</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">Ready to play Rock, Paper, Scissors against me? What's your name?</p>
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        placeholder="Your Name"
                        className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                    />
                    <button onClick={handleNameSubmit} className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                        Let's Do This!
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900/50 p-4 select-none">
            <div className="text-center mb-6 w-full">
                <h2 className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-200">
                    <span className="text-amber-500">{playerName}</span> vs <span className="text-stone-600 dark:text-stone-300">Tanmay</span>
                </h2>
                <div className="flex justify-center items-center gap-4 text-2xl font-bold mt-2">
                    <span className="text-amber-500">{playerScore}</span>
                    <span>-</span>
                    <span className="text-stone-600 dark:text-stone-300">{aiScore}</span>
                </div>
                 <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 min-h-[2rem] mt-2" aria-live="polite">
                    {gameWinner ? `${gameWinner} is the winner!` : status}
                </p>
            </div>

            <div className="flex items-center justify-around w-full max-w-md mb-6 min-h-[100px]">
                <div className="flex flex-col items-center">
                    <p className="font-bold mb-2">{playerName}</p>
                    <div className="w-24 h-24 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg flex items-center justify-center text-amber-500">
                       {playerChoice ? ICONS[playerChoice] : '?'}
                    </div>
                </div>
                 <p className="text-2xl font-bold text-stone-500">VS</p>
                 <div className="flex flex-col items-center">
                    <p className="font-bold mb-2">Tanmay</p>
                    <div className="w-24 h-24 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-300">
                        {aiChoice ? ICONS[aiChoice] : '?'}
                    </div>
                </div>
            </div>
            
            {gameWinner ? (
                <button
                    onClick={handleNextRound}
                    className="flex items-center justify-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
                >
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                </button>
            ) : roundOver ? (
                 <button
                    onClick={handleNextRound}
                    className="flex items-center justify-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
                >
                    Next Round
                </button>
            ) : (
                <div className="flex items-center gap-4">
                    {CHOICES.map(choice => (
                        <button
                            key={choice}
                            onClick={() => handlePlayerChoice(choice)}
                            className="w-20 h-20 bg-stone-200/80 dark:bg-stone-800/80 rounded-full flex items-center justify-center text-stone-800 dark:text-stone-200 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-all duration-200 transform hover:scale-110"
                            aria-label={choice}
                        >
                            {ICONS[choice]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RockPaperScissorsApp;