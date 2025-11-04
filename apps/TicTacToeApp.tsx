import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords } from 'lucide-react';

const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const Square: React.FC<{ value: string | null; onClick: () => void; }> = ({ value, onClick }) => (
    <button
        className="w-16 h-16 md:w-24 md:h-24 bg-stone-200/50 dark:bg-stone-800/50 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold transition-transform duration-300 ease-in-out transform hover:scale-105"
        onClick={onClick}
        aria-label={`Square ${value ? `with ${value}` : 'empty'}`}
    >
        <span className={value === 'X' ? 'text-amber-500' : 'text-stone-600 dark:text-stone-300'}>
            {value}
        </span>
    </button>
);

const TicTacToeApp: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isPlayerNext, setIsPlayerNext] = useState(true);

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const messages = {
        playerTurn: ["Your move!", "Let's see what you've got.", "Don't keep me waiting!", "The board is yours."],
        aiTurn: ["My turn!", "Thinking...", "Calculating the optimal move.", "Let me cook..."],
        playerWin: ["You got me! Well played.", "A worthy opponent indeed. Congrats!", "Beginner's luck? 😉 You win!"],
        aiWin: ["Checkmate! Better luck next time.", "A calculated victory.", "Guess I'm just too good at this. 😎"],
        draw: ["A battle of wits ends in a draw!", "A stalemate! Well played.", "We're evenly matched."]
    };
    
    const [status, setStatus] = useState("Let's play a game!");

    useEffect(() => {
        if (winner) {
            setStatus(winner === 'X' ? messages.playerWin[Math.floor(Math.random() * messages.playerWin.length)] : messages.aiWin[Math.floor(Math.random() * messages.aiWin.length)]);
        } else if (isDraw) {
            setStatus(messages.draw[Math.floor(Math.random() * messages.draw.length)]);
        } else {
            setStatus(isPlayerNext ? messages.playerTurn[Math.floor(Math.random() * messages.playerTurn.length)] : messages.aiTurn[Math.floor(Math.random() * messages.aiTurn.length)]);
        }
    }, [winner, isDraw, isPlayerNext]);

    const makeAIMove = (currentBoard: (string | null)[]) => {
        const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        
        // 1. AI win check
        for (let i of emptyIndices) {
            const tempBoard = [...currentBoard];
            tempBoard[i] = 'O';
            if (calculateWinner(tempBoard) === 'O') {
                return i;
            }
        }
        
        // 2. Player block check
        for (let i of emptyIndices) {
            const tempBoard = [...currentBoard];
            tempBoard[i] = 'X';
            if (calculateWinner(tempBoard) === 'X') {
                return i;
            }
        }

        // 3. Center
        if (currentBoard[4] === null) return 4;
        
        // 4. Corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => currentBoard[i] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // 5. Random
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };
    
    useEffect(() => {
        if (!isPlayerNext && !winner && !isDraw) {
            const timeout = setTimeout(() => {
                const newBoard = board.slice();
                const aiMove = makeAIMove(newBoard);
                if (aiMove !== undefined) {
                  newBoard[aiMove] = 'O';
                  setBoard(newBoard);
                  setIsPlayerNext(true);
                }
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [isPlayerNext, board, winner, isDraw]);

    const handlePlayerClick = (i: number) => {
        if (winner || board[i] || !isPlayerNext) {
            return;
        }
        const newBoard = board.slice();
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsPlayerNext(false);
    };

    const handleRestart = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerNext(true);
        setStatus("Let's go again!");
    };

    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
        }
    };

    if (!playerName) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <Swords size={48} className="text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Welcome, Challenger!</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">You're about to play against me, Tanmay! What's your name?</p>
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
                        Let's Play!
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900/50 p-4">
            <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-200">
                    <span className="text-amber-500">{playerName} (X)</span> vs <span className="text-stone-600 dark:text-stone-300">Tanmay (O)</span>
                </h2>
                <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 min-h-[2rem]" aria-live="polite">{status}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                {board.map((_, i) => (
                    <Square key={i} value={board[i]} onClick={() => handlePlayerClick(i)} />
                ))}
            </div>
            {(winner || isDraw) && (
                <button
                    onClick={handleRestart}
                    className="flex items-center justify-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
                >
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                </button>
            )}
        </div>
    );
};

export default TicTacToeApp;
