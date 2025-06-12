import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import SoundButton from "../../components/SoundButton";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import './ai-medium.css';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function PvAIMedium() {
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const playerName = state?.player1 || "Player";
  const boardTheme = localStorage.getItem("board") || "classic";

  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [winningCombo, setWinningCombo] = useState([]);

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
    if (showPopup || winningCombo.length > 0 || isPaused) return;

    let aiTimer;
    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          if (turn === "X") {
            setTurn("O");
            setTimeLeft(10);
            playSound("timeout.mp3");
            vibrateNow(100);
          }
          return 10;
        }
        return t - 1;
      });
    }, 1000);

    if (turn === "O") {
      const delay = Math.floor(Math.random() * 1500) + 1000;
      aiTimer = setTimeout(() => {
        aiMove();
      }, delay);
    }

    return () => {
      clearInterval(countdown);
      if (aiTimer) clearTimeout(aiTimer);
    };
  }, [turn, showPopup, winningCombo, isPaused]);

  const checkWin = (b, player) =>
    WIN_COMBOS.find(([a, bIdx, c]) => b[a] === player && b[bIdx] === player && b[c] === player) || [];

  const aiMove = () => {
    const b = [...board];
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        if (checkWin(b, "O").length) {
          move = i;
          break;
        }
        b[i] = "";
      }
    }

    if (move === null) {
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = "X";
          if (checkWin(b, "X").length) {
            move = i;
            break;
          }
          b[i] = "";
        }
      }
    }

    if (move === null) {
      const empty = b.map((val, i) => (val === "" ? i : null)).filter(i => i !== null);
      if (empty.length > 0) move = empty[Math.floor(Math.random() * empty.length)];
    }

    if (move !== null) makeMove(move);
  };

  const makeMove = (index) => {
    if (index === undefined || board[index] || showPopup || isPaused) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    playSound("move.wav");
    vibrateNow(vibrationStrength);

    const win = checkWin(newBoard, turn);
    if (win.length) {
      setWinningCombo(win);
      setPopupMsg(`${turn === "X" ? playerName : "AI"} Wins! 🎉`);
      setScore((prev) => ({ ...prev, [turn]: prev[turn] + 1 }));
      playSound("win.mp3");
      vibrateNow(vibrationStrength * 2);
      setShowPopup(true);
      return;
    }

    if (newBoard.every(cell => cell)) {
      setPopupMsg("It's a Draw! 🤝");
      playSound("draw.mp3");
      vibrateNow(100);
      setShowPopup(true);
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
    setTimeLeft(10);
  };

  const handleClick = (i) => {
    if (turn === "X") makeMove(i);
  };

  const nextRound = () => {
    setBoard(Array(9).fill(""));
    setTurn(round % 2 === 0 ? "X" : "O");
    setTimeLeft(10);
    setRound(r => r + 1);
    setPopupMsg("");
    setShowPopup(false);
    setWinningCombo([]);
  };

  const pauseOrResume = () => setIsPaused((p) => !p);

  return (
    <>
      <h2>Medium AI Mode - Round {round}</h2>

      <div className="scoreboard-title">
        <span className={turn === "X" ? "active-player" : ""}>{playerName} ❌</span>
        <span className="vs">vs</span>
        <span className={turn === "O" ? "active-player" : ""}>⭕ AI</span>
      </div>

      <div className="score-values">
        <span>{score.X}</span>
        <span>{score.O}</span>
      </div>

      <div className="timer">
        Time Left: {timeLeft}s
        <SoundButton onClick={pauseOrResume}>
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </SoundButton>
      </div>

      <div className={`pvp-container theme-${boardTheme}`}>
        <div className="game-board easy">
          {board.map((val, i) => (
            <div
              key={i}
              className={`cell ${val} ${winningCombo.includes(i) ? "win" : ""} xo-${boardTheme}`}
              onClick={() => handleClick(i)}
            >
              {val}
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
            setTimeLeft(10);
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

export default PvAIMedium;
