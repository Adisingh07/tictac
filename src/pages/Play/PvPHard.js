import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import SoundButton from "../../components/SoundButton";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import "../../styles/pvp-hard.css";

function PvPHard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { player1 = "Player 1", player2 = "Player 2", timer = 15 } = state || {};
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const boardSize = 5;
  const totalCells = boardSize * boardSize;
  const [board, setBoard] = useState(Array(totalCells).fill(""));
  const [turn, setTurn] = useState("X");
  const [winningCombo, setWinningCombo] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timeLeft, setTimeLeft] = useState(timer);
  const [isPaused, setIsPaused] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

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
    if (winningCombo.length > 0 || showPopup || showTimeoutPopup || isPaused) return;
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
  }, [turn, winningCombo, showPopup, showTimeoutPopup, isPaused]);

  const handleTimeout = () => {
    playSound("timeout.mp3");
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

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    playSound("click.wav");
    vibrateNow(80);
  };

  const handleClick = (i) => {
    if (board[i] || winningCombo.length > 0 || showPopup || showTimeoutPopup || isPaused) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);
    playSound("move.wav");
    vibrateNow(vibrationStrength);

    const win = checkWin(newBoard, turn);
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

  const checkWin = (b, symbol) => {
    const lines = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c <= boardSize - 4; c++) {
        const i = r * boardSize + c;
        lines.push([i, i + 1, i + 2, i + 3]);
      }
    }
    for (let c = 0; c < boardSize; c++) {
      for (let r = 0; r <= boardSize - 4; r++) {
        const i = r * boardSize + c;
        lines.push([i, i + boardSize, i + 2 * boardSize, i + 3 * boardSize]);
      }
    }
    for (let r = 0; r <= boardSize - 4; r++) {
      for (let c = 0; c <= boardSize - 4; c++) {
        const i = r * boardSize + c;
        lines.push([i, i + boardSize + 1, i + 2 * (boardSize + 1), i + 3 * (boardSize + 1)]);
      }
    }
    for (let r = 0; r <= boardSize - 4; r++) {
      for (let c = 3; c < boardSize; c++) {
        const i = r * boardSize + c;
        lines.push([i, i + boardSize - 1, i + 2 * (boardSize - 1), i + 3 * (boardSize - 1)]);
      }
    }
    return lines.find(line => line.every(i => b[i] === symbol)) || [];
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

  const confirmResetGame = () => setConfirmReset(true);
  const confirmExitGame = () => setConfirmExit(true);

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
    setConfirmReset(false);
  };

  return (
    <>
      <h2>Hard Mode - Round {round}</h2>
      <div className="scoreboard-title">
        <span className={turn === "X" ? "active-player" : ""}>❌ {player1}</span>
        <span className="vs">vs</span>
        <span className={turn === "O" ? "active-player" : ""}>⭕ {player2}</span>
      </div>
      <div className="score-values">
        <span>{score.X}</span><span></span><span>{score.O}</span>
      </div>

      <div className="timer">
        Time Left: {timeLeft}s
        <SoundButton onClick={togglePause} title={isPaused ? "Resume" : "Pause"}>
          {isPaused ? "▶️" : "⏸️"}
        </SoundButton>
      </div>

      <div className={`pvp-container theme-${theme}`}>
        <div className="game-board hard">
          {board.map((val, i) => (
            <div key={i} className={`cell ${val} ${winningCombo.includes(i) ? "win" : ""}`} onClick={() => handleClick(i)}>
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
      </div>

      <div className="action-buttons">
        <SoundButton onClick={confirmResetGame}>Reset</SoundButton>
        <SoundButton onClick={confirmExitGame}>Exit</SoundButton>
      </div>

      {confirmReset && (
        <ConfirmationPopup
          message="Are you sure you want to reset the game?"
          onConfirm={resetGame}
          onCancel={() => setConfirmReset(false)}
        />
      )}
      {confirmExit && (
        <ConfirmationPopup
          message="Are you sure you want to exit?"
          onConfirm={() => navigate("/")}
          onCancel={() => setConfirmExit(false)}
        />
      )}
    </>
  );
}

export default PvPHard;
