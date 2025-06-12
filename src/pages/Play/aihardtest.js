import { useState, useEffect } from 'react';
import './aihardtest.css';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const AiHard = () => {
  const [boardState, setBoardState] = useState(Array(9).fill(""));
  const [gameActive, setGameActive] = useState(true);
  const [playerStarts, setPlayerStarts] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [timeLeft, setTimeLeft] = useState(8);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [popupMessage, setPopupMessage] = useState("🎮 Round 1 – Ready?");
  const [showPopup, setShowPopup] = useState(true);
  const [showNextRound, setShowNextRound] = useState(false);

  useEffect(() => {
    if (gameStarted && gameActive) {
      const timer = currentTurn === "X" ? setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 8;
          }
          return prev - 1;
        });
      }, 1000) : null;

      return () => clearInterval(timer);
    }
  }, [gameStarted, gameActive, currentTurn]);

  const handleTimeout = () => {
    if (currentTurn === "X") {
      setCurrentTurn("O");
      setTimeLeft(8);
      aiMove();
    } else {
      setCurrentTurn("X");
      setTimeLeft(8);
    }
  };

  const handlePlayerMove = (index) => {
    if (!gameActive || currentTurn !== "X" || boardState[index] !== "") return;
    makeMove(index, "X");
    if (checkGameEnd()) return;
    setCurrentTurn("O");
    setTimeLeft(8);
    aiMove();
  };

  const aiMove = () => {
    if (!gameActive || currentTurn !== "O") return;
    const index = getBestMove([...boardState]);
    makeMove(index, "O");
    if (checkGameEnd()) return;
    setCurrentTurn("X");
    setTimeLeft(8);
  };

  const makeMove = (index, player) => {
    const newBoard = [...boardState];
    newBoard[index] = player;
    setBoardState(newBoard);
  };

  const checkWin = (player) => {
    return WIN_COMBOS.some(combo => combo.every(i => boardState[i] === player));
  };

  const checkGameEnd = () => {
    if (checkWin("X")) {
      setPlayerScore(prev => prev + 1);
      showGameEndPopup("🎉 You win!");
      return true;
    }
    if (checkWin("O")) {
      setAiScore(prev => prev + 1);
      showGameEndPopup("😈 AI wins!");
      return true;
    }
    if (boardState.every(cell => cell !== "")) {
      showGameEndPopup("😐 It's a draw!");
      return true;
    }
    return false;
  };

  const showGameEndPopup = (msg) => {
    setPopupMessage(`${msg}\nReady for Round ${round + 1}?`);
    setShowPopup(true);
    setShowNextRound(true);
    setGameActive(false);
  };

  const startNextRound = () => {
    setRound(prev => prev + 1);
    setBoardState(Array(9).fill(""));
    setGameActive(true);
    setCurrentTurn(!playerStarts ? "X" : "O");
    setPlayerStarts(prev => !prev);
    setShowPopup(false);
    setShowNextRound(false);
    setTimeLeft(8);
    setGameStarted(true);
    if (!playerStarts) {
      aiMove();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setShowPopup(false);
    setShowNextRound(false);
    setTimeLeft(8);
    if (!playerStarts) {
      aiMove();
    }
  };

  const resetGame = () => {
    setRound(1);
    setPlayerScore(0);
    setAiScore(0);
    setCurrentTurn("X");
    setBoardState(Array(9).fill(""));
    setGameActive(true);
    setTimeLeft(8);
    setPlayerStarts(true);
    setGameStarted(false);
    setPopupMessage("🎮 Round 1 – Ready?");
    setShowPopup(true);
    setShowNextRound(false);
  };

  // Minimax AI algorithm
  const getBestMove = (state) => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "O";
        let score = minimax(state, 0, false);
        state[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (state, depth, isMaximizing) => {
    if (checkWinState(state, "O")) return 10 - depth;
    if (checkWinState(state, "X")) return depth - 10;
    if (state.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (state[i] === "") {
          state[i] = "O";
          best = Math.max(best, minimax(state, depth + 1, false));
          state[i] = "";
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (state[i] === "") {
          state[i] = "X";
          best = Math.min(best, minimax(state, depth + 1, true));
          state[i] = "";
        }
      }
      return best;
    }
  };

  const checkWinState = (state, player) => {
    return WIN_COMBOS.some(combo => combo.every(i => state[i] === player));
  };

  return (
    <div className="ai-hard-container">
      <h1>Tic Tac Toe - Hard Mode</h1>

      <div className="round-display">Round: {round}</div>

      <div className="scoreboard">
        <div>Player (X): <span className="player-score">{playerScore}</span></div>
        <div className="timer">Timer: <span className="turn-timer">{timeLeft}s</span></div>
        <div>AI (O): <span className="ai-score">{aiScore}</span></div>
      </div>

      <div className="game-board">
        {boardState.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => gameStarted ? handlePlayerMove(index) : null}
          >
            {cell}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            {!gameStarted && (
              <button className="start-button" onClick={startGame}>Start</button>
            )}
            {showNextRound && (
              <button className="next-round-button" onClick={startNextRound}>Next Round</button>
            )}
          </div>
        </div>
      )}

      <div className="actions">
        <button onClick={resetGame}>Reset</button>
        <button onClick={() => window.location.href = "/"}>Exit</button>
      </div>
    </div>
  );
};

export default AiHard;