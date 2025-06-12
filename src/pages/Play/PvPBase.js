import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./pvp.css";

function generateWinCombos(size, winLength) {
  const combos = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const combo = [];
      for (let k = 0; k < winLength; k++) combo.push(r * size + c + k);
      combos.push(combo);
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const combo = [];
      for (let k = 0; k < winLength; k++) combo.push((r + k) * size + c);
      combos.push(combo);
    }
  }

  // Diagonals (top-left to bottom-right)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const combo = [];
      for (let k = 0; k < winLength; k++) combo.push((r + k) * size + (c + k));
      combos.push(combo);
    }
  }

  // Diagonals (top-right to bottom-left)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const combo = [];
      for (let k = 0; k < winLength; k++) combo.push((r + k) * size + (c - k));
      combos.push(combo);
    }
  }

  return combos;
}

export default function PvPBase({ boardSize, winLength, mode }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    player1 = "Player 1",
    player2 = "Player 2",
    timer = 15,
  } = state || {};

  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const totalCells = boardSize * boardSize;
  const WIN_COMBOS = generateWinCombos(boardSize, winLength);

  const [board, setBoard] = useState(Array(totalCells).fill(""));
  const [turn, setTurn] = useState("X");
  const [winningCombo, setWinningCombo] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timeLeft, setTimeLeft] = useState(timer);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);

  const playSound = (file) => {
    if (!soundOn) return;
    const audio = new Audio(`/sounds/${file}`);
    audio.volume = soundVolume;
    audio.play();
  };

  const vibrateNow = (ms) => {
    if (vibration && navigator.vibrate) navigator.vibrate(ms);
  };

  useEffect(() => {
    if (winningCombo.length > 0 || showPopup || showTimeoutPopup) return;
    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          handleTimeout();
          return timer;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [turn, winningCombo, showPopup, showTimeoutPopup]);

  const handleTimeout = () => {
    playSound("click.wav");
    vibrateNow(100);
    setPopupMsg(`⏱️ Time's up! It's ${turn === "X" ? player2 : player1}'s turn`);
    setShowTimeoutPopup(true);
  };

  const resumeAfterTimeout = () => {
    setTurn((prev) => (prev === "X" ? "O" : "X"));
    setTimeLeft(timer);
    setPopupMsg("");
    setShowTimeoutPopup(false);
  };

  const handleClick = (i) => {
    if (board[i] || winningCombo.length > 0 || showPopup || showTimeoutPopup) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);
    playSound("move.wav");
    vibrateNow(vibrationStrength);

    const win = checkWin(newBoard);
    if (win.length > 0) {
      setWinningCombo(win);
      setScore((prev) => ({ ...prev, [turn]: prev[turn] + 1 }));
      playSound("win.mp3");
      vibrateNow(vibrationStrength * 2);
      setPopupMsg(`${turn === "X" ? player1 : player2} Wins! 🎉`);
      setShowPopup(true);
      return;
    }

    if (newBoard.every((cell) => cell !== "")) {
      playSound("draw.mp3");
      vibrateNow(vibrationStrength);
      setPopupMsg("It's a Draw! 😐");
      setShowPopup(true);
      return;
    }

    setTurn((prev) => (prev === "X" ? "O" : "X"));
    setTimeLeft(timer);
  };

  const checkWin = (b) => {
    return WIN_COMBOS.find((combo) =>
      combo.every((idx) => b[idx] && b[idx] === b[combo[0]])
    ) || [];
  };

  const nextRound = () => {
    setBoard(Array(totalCells).fill(""));
    setWinningCombo([]);
    setRound((r) => r + 1);
    setTurn(round % 2 === 0 ? "X" : "O");
    setTimeLeft(timer);
    setPopupMsg("");
    setShowPopup(false);
  };

  const resetGame = () => {
    setBoard(Array(totalCells).fill(""));
    setWinningCombo([]);
    setScore({ X: 0, O: 0 });
    setRound(1);
    setTurn("X");
    setTimeLeft(timer);
    setPopupMsg("");
    setShowPopup(false);
    setShowTimeoutPopup(false);
  };

  return (
    <div className={`pvp-container theme-${localStorage.getItem("board") || "classic"}`}>
      <h2>{mode} Mode - Round {round}</h2>

      {/* Scoreboard */}
      <div className="scoreboard-title">
        <span className={turn === "X" ? "active-player" : ""}>❌ {player1}</span>
        <span className="vs">vs</span>
        <span className={turn === "O" ? "active-player" : ""}>⭕ {player2}</span>
      </div>
      <div className="score-values">
        <span>{score.X}</span>
        <span></span>
        <span>{score.O}</span>
      </div>

      <div className="timer">Time Left: {timeLeft}s</div>

      <div className={`game-board ${mode.toLowerCase()}`}>
        {board.map((val, i) => (
          <div
            key={i}
            className={`cell ${val} ${winningCombo.includes(i) ? "win" : ""}`}
            onClick={() => handleClick(i)}
          >
            <span className={`xo-${localStorage.getItem("xoStyle") || "classic"}`}>{val}</span>

          </div>
        ))}
      </div>

      {/* Win/Draw Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{popupMsg}</h3>
            <button onClick={nextRound}>Next Round</button>
          </div>
        </div>
      )}

      {/* Timeout Popup */}
      {showTimeoutPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{popupMsg}</h3>
            <button onClick={resumeAfterTimeout}>Resume Turn</button>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={resetGame}>Reset</button>
        <button onClick={() => navigate("/")}>Exit</button>
      </div>
    </div>
  );
}
