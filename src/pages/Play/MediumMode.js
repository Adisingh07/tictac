import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './Play.css';

const initialBoard = Array(9).fill("");
const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function MediumMode() {
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);
  const [board, setBoard] = useState(initialBoard);
  const [playerStarts, setPlayerStarts] = useState(true);
  const [turn, setTurn] = useState("X");
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [message, setMessage] = useState("Your Turn");
  const [winningCombo, setWinningCombo] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);

  const theme = localStorage.getItem("board") || "classic";

  const playSound = (file) => {
    if (!soundOn) return;
    const audio = new Audio(`/sounds/${file}`);
    audio.volume = soundVolume;
    audio.play();
  };

  const vibrate = (ms) => {
    if (vibration && navigator.vibrate) navigator.vibrate(ms);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [turn]);

  const handleTimeout = () => {
    setMessage(`${turn} missed the turn!`);
    setTurn(turn === "X" ? "O" : "X");
  };

  const handleCellClick = (index) => {
    if (turn !== "X" || board[index] || winningCombo.length > 0) return;
    makeMove(index, "X");
    playSound('move.wav');
    vibrate(vibrationStrength);

    if (checkWinOrDraw("X")) return;

    setTimeout(() => {
      aiMove();
    }, Math.floor(Math.random() * 1000) + 1000); // 1–2 sec delay
  };

  const aiMove = () => {
    if (turn !== "O") return;
    const move = getMediumAIMove();
    makeMove(move, "O");
    playSound('move.wav');
    vibrate(vibrationStrength);

    checkWinOrDraw("O");
  };

  const makeMove = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setTurn(player === "X" ? "O" : "X");
  };

  const checkWinOrDraw = (player) => {
    const result = checkWin(board);
    if (result) {
      setWinningCombo(result);
      setMessage(player === "X" ? "🎉 You Win!" : "😈 AI Wins!");
      playSound(player === "X" ? 'win.mp3' : 'lose.mp3');
      vibrate(vibrationStrength * 2);
      if (player === "X") setPlayerScore(p => p + 1);
      else setAiScore(p => p + 1);
      return true;
    }

    if (board.every(cell => cell)) {
      setMessage("😐 It's a Draw!");
      playSound("draw.mp3");
      vibrate(vibrationStrength);
      return true;
    }

    setMessage(turn === "X" ? "Your Turn" : "AI Turn");
    return false;
  };

  const getMediumAIMove = () => {
    const tempBoard = [...board];

    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!tempBoard[i]) {
        tempBoard[i] = "O";
        if (checkWin(tempBoard)) return i;
        tempBoard[i] = "";
      }
    }

    // Try to block player
    for (let i = 0; i < 9; i++) {
      if (!tempBoard[i]) {
        tempBoard[i] = "X";
        if (checkWin(tempBoard)) return i;
        tempBoard[i] = "";
      }
    }

    // Else pick random
    const empty = tempBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const checkWin = (b) => {
    return WIN_COMBOS.find(([a,bIdx,c]) =>
      b[a] && b[a] === b[bIdx] && b[a] === b[c]
    );
  };

  const nextRound = () => {
    setBoard(initialBoard);
    setWinningCombo([]);
    setPlayerStarts(p => !p);
    setTurn(playerStarts ? "O" : "X");
    setMessage(playerStarts ? "AI Turn" : "Your Turn");
    setRound(r => r + 1);
    setTimeLeft(15);
    if (!playerStarts) {
      setTimeout(() => aiMove(), 1000);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinningCombo([]);
    setPlayerScore(0);
    setAiScore(0);
    setRound(1);
    setTurn("X");
    setPlayerStarts(true);
    setMessage("Your Turn");
    setTimeLeft(15);
  };

  return (
    <div className={`pvp-container theme-${theme}`}>
      <h2>AI Medium Mode - Round {round}</h2>

      <div className="scoreboard">
        <div>You: {playerScore}</div>
        <div>AI: {aiScore}</div>
      </div>

      <div className="timer">Time Left: {timeLeft}s</div>

      <div className="game-board">
        {board.map((cell, idx) => (
          <div
            key={idx}
            className={`cell ${cell} ${winningCombo.includes(idx) ? "win" : ""}`}
            onClick={() => handleCellClick(idx)}
          >
            {cell}
          </div>
        ))}
      </div>

      <p className="status-msg">{message}</p>

      <div className="action-buttons">
        <button onClick={nextRound}>Next Round</button>
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
}

export default MediumMode;
