import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./ai-hard.css";

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function AiHard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const playerName = state?.player || "Player";

  const {
    soundOn,
    soundVolume,
    vibration,
    vibrationStrength,
    toggleSound,
  } = useContext(AppContext);
  const theme = localStorage.getItem("board") || "classic";

  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningCombo, setWinningCombo] = useState([]);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(25);
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

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
    if (turn === "X" && !showPopup && winningCombo.length === 0) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setTurn("O");
            setTimeLeft(25);
            playSound("click.wav");
            vibrateNow(100);
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [turn, showPopup, winningCombo]);

  useEffect(() => {
    if (turn === "O" && !showPopup && winningCombo.length === 0) {
      const delay = Math.floor(Math.random() * 1000) + 500;
      setTimeout(() => {
        const bestMove = getBestMove(board);
        handleClick(bestMove);
      }, delay);
    }
  }, [turn, showPopup, winningCombo]);

  const handleClick = (i) => {
    if (board[i] || showPopup || winningCombo.length > 0) return;

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
      setPopupMsg(`${turn === "X" ? playerName : "AI"} Wins! 🎉`);
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
    setTimeLeft(25);
  };

  const checkWin = (b) => {
    return (
      WIN_COMBOS.find(
        ([a, bIdx, c]) => b[a] && b[a] === b[bIdx] && b[bIdx] === b[c]
      ) || []
    );
  };

  const nextRound = () => {
    setBoard(Array(9).fill(""));
    setWinningCombo([]);
    setTurn(round % 2 === 0 ? "X" : "O");
    setTimeLeft(25);
    setPopupMsg("");
    setShowPopup(false);
    setRound((r) => r + 1);
  };

  const confirmReset = () => {
    playSound("click.wav");
    setShowConfirmReset(true);
  };

  const confirmExit = () => {
    playSound("click.wav");
    setShowConfirmExit(true);
  };

  const resetGame = () => {
    playSound("click.wav");
    setBoard(Array(9).fill(""));
    setWinningCombo([]);
    setScore({ X: 0, O: 0 });
    setTurn("X");
    setRound(1);
    setTimeLeft(25);
    setPopupMsg("");
    setShowPopup(false);
    setShowConfirmReset(false);
  };

  const exitGame = () => {
    playSound("click.wav");
    navigate("/");
  };

  const getBestMove = (b) => {
    const ai = "O";
    const human = "X";

    const minimax = (board, depth, isMaximizing) => {
      const winCombo = checkWin(board);
      if (winCombo.length > 0) {
        const winner = board[winCombo[0]];
        if (winner === ai) return 10 - depth;
        if (winner === human) return depth - 10;
      }
      if (board.every((cell) => cell !== "")) return 0;

      if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === "") {
            board[i] = ai;
            const score = minimax(board, depth + 1, false);
            board[i] = "";
            best = Math.max(best, score);
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === "") {
            board[i] = human;
            const score = minimax(board, depth + 1, true);
            board[i] = "";
            best = Math.min(best, score);
          }
        }
        return best;
      }
    };

    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === "") {
        b[i] = ai;
        const score = minimax(b, 0, false);
        b[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  return (
    <>
      <h2>AI Impossible - Round {round}</h2>

      <div className="scoreboard-title">
        <span className={turn === "X" ? "active-player" : ""}>
          ❌ {playerName}
        </span>
        <span className="vs">vs</span>
        <span className={turn === "O" ? "active-player" : ""}>🤖 AI</span>
      </div>
      <div className="score-values">
        <span>{score.X}</span>
        <span></span>
        <span>{score.O}</span>
      </div>

      <div className="timer">Time Left: {timeLeft}s</div>

      {/* <div className="sound-toggle">
        <button onClick={toggleSound}>
          {soundOn ? "🔊 Sound ON" : "🔇 Sound OFF"}
        </button>
      </div> */}

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
              <button onClick={nextRound}>Next Round</button>
            </div>
          </div>
        )}

        {showConfirmReset && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Reset the game?</h3>
              <p>This will clear all scores and start a new game.</p>
              <div className="confirm-buttons">
                <button onClick={resetGame}>Yes, Reset</button>
                <button onClick={() => setShowConfirmReset(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showConfirmExit && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Exit the game?</h3>
              <p>Your current progress will not be saved.</p>
              <div className="confirm-buttons">
                <button onClick={exitGame}>Yes, Exit</button>
                <button onClick={() => setShowConfirmExit(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={confirmReset}>Reset</button>
        <button onClick={confirmExit}>Exit</button>
      </div>
    </>
  );
}

export default AiHard;
