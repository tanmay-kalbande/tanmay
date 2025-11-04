import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords } from 'lucide-react';

const ROWS = 6;
const COLS = 7;
const PLAYER = 1;
const AI = 2;

type Board = (0 | 1 | 2)[][];

const ConnectFourApp: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [board, setBoard] = useState<Board>(() => Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    const [turn, setTurn] = useState(PLAYER);
    const [winner, setWinner] = useState<0 | 1 | 2 | 'draw'>(0);

    const checkWinner = (b: Board) => {
        // Horizontal, Vertical, Diagonal checks
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (b[r][c] === 0) continue;
                // Horizontal
                if (c <= COLS - 4 && b[r][c] === b[r][c+1] && b[r][c] === b[r][c+2] && b[r][c] === b[r][c+3]) return b[r][c];
                // Vertical
                if (r <= ROWS - 4 && b[r][c] === b[r+1][c] && b[r][c] === b[r+2][c] && b[r][c] === b[r+3][c]) return b[r][c];
                // Diagonal (down-right)
                if (r <= ROWS - 4 && c <= COLS - 4 && b[r][c] === b[r+1][c+1] && b[r][c] === b[r+2][c+2] && b[r][c] === b[r+3][c+3]) return b[r][c];
                // Diagonal (up-right)
                if (r >= 3 && c <= COLS - 4 && b[r][c] === b[r-1][c+1] && b[r][c] === b[r-2][c+2] && b[r][c] === b[r-3][c+3]) return b[r][c];
            }
        }
        if (b.flat().every(cell => cell !== 0)) return 'draw';
        return 0;
    };
    
    const getAIMove = (currentBoard: Board): number => {
        // 1. Check if AI can win
        for (let c = 0; c < COLS; c++) {
            if (currentBoard[0][c] === 0) {
                const tempBoard = dropPiece(currentBoard, c, AI);
                if (checkWinner(tempBoard) === AI) return c;
            }
        }
        // 2. Check if Player can win and block
        for (let c = 0; c < COLS; c++) {
            if (currentBoard[0][c] === 0) {
                const tempBoard = dropPiece(currentBoard, c, PLAYER);
                if (checkWinner(tempBoard) === PLAYER) return c;
            }
        }
        // 3. Prioritize center
        const centerCols = [3, 2, 4, 1, 5, 0, 6];
        for(const c of centerCols) {
             if (currentBoard[0][c] === 0) return c;
        }

        return -1; // Should not happen
    }

    useEffect(() => {
        if (turn === AI && !winner) {
            const timeout = setTimeout(() => {
                const col = getAIMove(board);
                if (col !== -1) {
                    const newBoard = dropPiece(board, col, AI);
                    setBoard(newBoard);
                    const newWinner = checkWinner(newBoard);
                    if (newWinner) setWinner(newWinner);
                    else setTurn(PLAYER);
                }
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [turn, board, winner]);

    const dropPiece = (currentBoard: Board, col: number, player: 1 | 2): Board => {
        const newBoard = currentBoard.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (newBoard[r][col] === 0) {
                newBoard[r][col] = player;
                return newBoard;
            }
        }
        return newBoard;
    };

    const handlePlayerMove = (col: number) => {
        if (turn !== PLAYER || winner || board[0][col] !== 0) return;

        const newBoard = dropPiece(board, col, PLAYER);
        setBoard(newBoard);
        const newWinner = checkWinner(newBoard);

        if (newWinner) {
            setWinner(newWinner);
        } else {
            setTurn(AI);
        }
    };

    const handleRestart = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
        setTurn(PLAYER);
        setWinner(0);
    };
    
    const handleNameSubmit = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
        }
    };
    
    const getStatusMessage = () => {
        if (winner === PLAYER) return `You win, ${playerName}! Well played.`;
        if (winner === AI) return "I win this time! Better luck next round.";
        if (winner === 'draw') return "It's a draw! A worthy match.";
        return turn === PLAYER ? "Your turn..." : "My turn, thinking...";
    }

    if (!playerName) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200">
                <Swords size={48} className="text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">A game of strategy!</h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">Ready to challenge me in Connect Four? What's your name?</p>
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()} placeholder="Your Name" className="w-full bg-stone-200 dark:bg-stone-800 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400" />
                    <button onClick={handleNameSubmit} className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">Let's Play!</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900/50 p-2 md:p-4">
            <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-200">
                    <span className="text-amber-500">{playerName} (Yellow)</span> vs <span className="text-red-500">Tanmay (Red)</span>
                </h2>
                <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 min-h-[2rem]">{getStatusMessage()}</p>
            </div>
            <div className="bg-blue-800 p-2 md:p-3 rounded-lg shadow-inner">
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {board.map((row, r) => 
                        row.map((cell, c) => (
                            <div key={`${r}-${c}`} onClick={() => handlePlayerMove(c)} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center cursor-pointer">
                                <div className={`w-full h-full rounded-full transition-colors ${cell === PLAYER ? 'bg-amber-400' : cell === AI ? 'bg-red-500' : 'bg-stone-200 dark:bg-stone-700'}`}></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {winner !== 0 && (
                <button onClick={handleRestart} className="mt-4 flex items-center justify-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors">
                    <RotateCcw size={16} className="mr-2" /> Play Again
                </button>
            )}
        </div>
    );
};

export default ConnectFourApp;
