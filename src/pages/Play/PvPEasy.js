import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import SoundButton from "../../components/SoundButton";
import './pvp.css';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function PvPEasy() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    player1 = "Player 1",
    player2 = "Player 2",
    timer = 15,
  } = state || {};

  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [winningCombo, setWinningCombo] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timeLeft, setTimeLeft] = useState(timer);
  const [isPaused, setIsPaused] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const theme = localStorage.getItem("board") || "classic";

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
    if (isPaused || winningCombo.length > 0 || showPopup || showTimeoutPopup) return;
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
  }, [turn, isPaused, winningCombo, showPopup, showTimeoutPopup]);

  const handleTimeout = () => {
    playSound("timeout.mp3");
    vibrateNow(150);
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
    if (board[i] || winningCombo.length > 0 || showPopup || showTimeoutPopup || isPaused) return;
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
    return WIN_COMBOS.find(([a, bIdx, c]) => b[a] && b[a] === b[bIdx] && b[bIdx] === b[c]) || [];
  };

  const nextRound = () => {
    setBoard(Array(9).fill(""));
    setWinningCombo([]);
    setRound((r) => r + 1);
    setTurn(round % 2 === 0 ? "X" : "O");
    setTimeLeft(timer);
    setPopupMsg("");
    setShowPopup(false);
  };

  const confirmReset = () => setConfirmAction("reset");
  const confirmExit = () => setConfirmAction("exit");

  const handleConfirmYes = () => {
    if (confirmAction === "reset") {
      setBoard(Array(9).fill(""));
      setWinningCombo([]);
      setScore({ X: 0, O: 0 });
      setRound(1);
      setTurn("X");
      setTimeLeft(timer);
    } else {
      navigate("/");
    }
    setConfirmAction(null);
  };

  const handleConfirmNo = () => setConfirmAction(null);

  return (
    <>
      <h2>Easy Mode - Round {round}</h2>

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

      <div className="timer">
        Time Left: {timeLeft}s
        <SoundButton onClick={() => setIsPaused(!isPaused)} title={isPaused ? "Resume" : "Pause"}>
          {isPaused ? "▶️" : "⏸️"}
        </SoundButton>
      </div>

      <div className={`pvp-container theme-${theme}`}>
        <div className="game-board easy">
          {board.map((val, i) => (
            <div
              key={i}
              className={`cell ${val} ${winningCombo.includes(i) ? "win" : ""}`}
              onClick={() => handleClick(i)}
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

        {showTimeoutPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>{popupMsg}</h3>
              <SoundButton onClick={resumeAfterTimeout}>Resume Turn</SoundButton>
            </div>
          </div>
        )}

        {confirmAction && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Are you sure you want to {confirmAction === "reset" ? "reset the game" : "exit"}?</h3>
              <div className="confirm-buttons">
                <SoundButton onClick={handleConfirmYes}>Yes</SoundButton>
                <SoundButton onClick={handleConfirmNo}>No</SoundButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <SoundButton onClick={confirmReset}>Reset</SoundButton>
        <SoundButton onClick={confirmExit}>Exit</SoundButton>
      </div>
    </>
  );
}

export default PvPEasy;
