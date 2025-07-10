import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component for Tic-Tac-Toe.
 * Provides 2-player local gameplay with dynamic board,
 * win/tie detection, and reset functionality, in a modern UI.
 */
function App() {
  const emptyBoard = Array(9).fill(null);

  // State
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [theme, setTheme] = useState('light');

  // Game status effect
  useEffect(() => {
    // Win detection
    const detectedWinner = calculateWinner(board);
    if (detectedWinner) {
      setWinner(detectedWinner);
      setScores((prev) => ({
        ...prev,
        [detectedWinner]: prev[detectedWinner] + 1,
      }));
      setIsTie(false);
    } else if (board.every((cell) => cell !== null)) {
      setIsTie(true);
      setWinner(null);
    } else {
      setWinner(null);
      setIsTie(false);
    }
  }, [board]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (winner || isTie || board[idx]) return; // Ignore if over or cell filled
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setWinner(null);
    setIsTie(false);
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // PUBLIC_INTERFACE
  function getStatusText() {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (isTie) {
      return "It's a tie!";
    } else {
      return `Next: ${xIsNext ? 'X' : 'O'}`;
    }
  }

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: '100vh' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div
          style={{
            marginBottom: 32,
            width: '100%',
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 32,
              margin: '24px 0 6px 0',
              fontWeight: 700,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
            }}
          >
            Tic-Tac-Toe
          </h1>
          <div
            style={{
              fontSize: 18,
              color: theme === 'light' ? '#1976D2' : '#FFEB3B',
              fontWeight: 500,
              minHeight: 28,
              marginBottom: 6,
            }}
            aria-live="polite"
            data-testid="game-status"
          >
            {getStatusText()}
          </div>
          <div style={{
            fontSize: 16,
            color: "var(--text-primary)",
            display: 'flex',
            gap: 16,
            marginBottom: 18,
          }}>
            <span>
              X: <strong data-testid="score-x">{scores.X}</strong>
            </span>
            <span>
              O: <strong data-testid="score-o">{scores.O}</strong>
            </span>
          </div>
        </div>
        {/* Game Board */}
        <Board
          squares={board}
          onSquareClick={handleSquareClick}
          winningLine={winner ? getWinningLine(board) : []}
        />
        <div style={{ margin: '28px 0 0 0' }}>
          <button
            style={{
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 34px',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(32, 38, 90, 0.09)',
              letterSpacing: '0.1em',
              transition: 'background 0.25s',
            }}
            onClick={resetGame}
            aria-label="Reset Game"
          >
            Reset
          </button>
        </div>
        <footer style={{
          marginTop: 42,
          color: '#BBB',
          fontSize: 15,
          opacity: .95,
          letterSpacing: '.04em'
        }}>
          <span>
            Made with <span style={{color:'#E87A41',fontWeight:'bold'}}>React</span>
          </span>
        </footer>
      </header>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component - renders the 3x3 grid
 */
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(idx) {
    const isWinning = winningLine && winningLine.includes(idx);
    return (
      <button
        key={idx}
        className="ttt-square"
        style={{
          background: isWinning ? '#FFEB3B88' : 'var(--bg-secondary)',
          border: `2.2px solid ${isWinning ? '#FFEB3B' : 'var(--border-color)'}`,
          color: squares[idx] === "X" ? "#1976D2" : "#424242",
          fontSize: 32,
          fontWeight: 700,
          width: 70, height: 70,
          borderRadius: 14,
          margin: 0,
          outline: 'none',
          boxShadow: isWinning
            ? '0 0 0 3px #FFEB3B33'
            : '0 2px 4px rgba(0,0,0,0.05)',
          cursor: squares[idx] ? "not-allowed" : "pointer",
          transition: "background 0.17s, border 0.17s, color 0.11s"
        }}
        onClick={() => onSquareClick(idx)}
        aria-label={`Square ${idx + 1} ${squares[idx] ? squares[idx] : ''}`}
        data-testid={`square-${idx}`}
        disabled={!!squares[idx]}
      >{squares[idx]}</button>
    );
  }

  // 3x3 grid
  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,70px)',
        gridTemplateRows: 'repeat(3,70px)',
        gap: '14px',
        margin: '0 auto',
        marginBottom: 2,
        marginTop: 4,
        background: 'transparent',
      }}
    >
      {Array(9).fill(0).map((_, idx) => renderSquare(idx))}
    </div>
  );
}

/**
 * Calculates winner ('X' or 'O') if there is one.
 */
function calculateWinner(squares) {
  // All possible lines
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Returns the winning line as an array of indices, or [].
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return [];
}

export default App;
