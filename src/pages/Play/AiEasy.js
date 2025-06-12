import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import SoundButton from "../../components/SoundButton";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import "./ai-easy.css";

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function AiEasy() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const playerName = state?.player || "Player";
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);
  const theme = localStorage.getItem("board") || "classic";

  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningCombo, setWinningCombo] = useState([]);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

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
    if (turn === "X" && !showPopup && winningCombo.length === 0 && !isPaused) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleTimeout();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [turn, showPopup, winningCombo, isPaused]);

  const handleTimeout = () => {
    playSound("timeout.mp3");
    vibrateNow(100);
    setTurn("O");
    setTimeLeft(15);
  };

  useEffect(() => {
    if (turn === "O" && !showPopup && winningCombo.length === 0 && !isPaused) {
      const delay = Math.floor(Math.random() * 2000) + 1000;
      const timer = setTimeout(() => {
        makeAIMove();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [turn, showPopup, winningCombo, isPaused]);

  const makeAIMove = () => {
    const empty = board.map((val, i) => (val === "" ? i : null)).filter(i => i !== null);
    for (let i of empty) {
      const temp = [...board];
      temp[i] = "O";
      if (checkWin(temp).length > 0) return handleClick(i);
    }
    for (let i of empty) {
      const temp = [...board];
      temp[i] = "X";
      if (checkWin(temp).length > 0) return handleClick(i);
    }
    const randomIndex = empty[Math.floor(Math.random() * empty.length)];
    handleClick(randomIndex);
  };

  const handleClick = (i) => {
    if (board[i] || showPopup || winningCombo.length > 0 || isPaused) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);
    playSound("move.wav");
    vibrateNow(vibrationStrength);

    const win = checkWin(newBoard);
    if (win.length > 0) {
      setWinningCombo(win);
      setScore((s) => ({ ...s, [turn]: s[turn] + 1 }));
      playSound("win.mp3");
      vibrateNow(vibrationStrength * 2);
      setPopupMsg(`${turn === "X" ? playerName : "AI"} Wins! 🎉`);
      setShowPopup(true);
      return;
    }

    if (newBoard.every(cell => cell !== "")) {
      playSound("draw.mp3");
      vibrateNow(vibrationStrength);
      setPopupMsg("It's a Draw! 😐");
      setShowPopup(true);
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
    setTimeLeft(15);
  };

  const checkWin = (b) => {
    return WIN_COMBOS.find(([a, bIdx, c]) => b[a] && b[a] === b[bIdx] && b[bIdx] === b[c]) || [];
  };

  const nextRound = () => {
    setBoard(Array(9).fill(""));
    setWinningCombo([]);
    setTurn(round % 2 === 0 ? "X" : "O");
    setTimeLeft(15);
    setPopupMsg("");
    setShowPopup(false);
    setRound(r => r + 1);
  };

  const pauseOrResume = () => setIsPaused(p => !p);

  return (
    <>
      <h2>AI Easy - Round {round}</h2>

      <div className="scoreboard-title">
        <span className={turn === "X" ? "active-player" : ""}>❌ {playerName}</span>
        <span className="vs">vs</span>
        <span className={turn === "O" ? "active-player" : ""}>🤖 AI</span>
      </div>

      <div className="score-values">
        <span>{score.X}</span>
        <span></span>
        <span>{score.O}</span>
      </div>

      <div className="timer">
        Time Left: {timeLeft}s
        <SoundButton onClick={pauseOrResume}>
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </SoundButton>
      </div>

      <div className={`pvp-container theme-${theme}`}>
        <div className="game-board easy">
          {board.map((val, i) => (
            <div
              key={i}
              className={`cell ${val} ${winningCombo.includes(i) ? "win" : ""}`}
              onClick={() => turn === "X" && handleClick(i)}
            >
              <span className={`xo xo-${theme}`}>{val}</span>
            </div>
          ))}
        </div>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>{popupMsg}</h3>
              <SoundButton onClick={nextRound}>Next Round</SoundButton>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <SoundButton onClick={() => setConfirmReset(true)}>Reset</SoundButton>
        <SoundButton onClick={() => setConfirmExit(true)}>Exit</SoundButton>
      </div>

      {confirmReset && (
        <ConfirmationPopup
          message="Reset game?"
          onConfirm={() => {
            setConfirmReset(false);
            setBoard(Array(9).fill(""));
            setWinningCombo([]);
            setScore({ X: 0, O: 0 });
            setTurn("X");
            setRound(1);
            setTimeLeft(15);
            setPopupMsg("");
            setShowPopup(false);
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
      {confirmExit && (
        <ConfirmationPopup
          message="Exit game?"
          onConfirm={() => navigate("/")}
          onCancel={() => setConfirmExit(false)}
        />
      )}
    </>
  );
}

export default AiEasy;
