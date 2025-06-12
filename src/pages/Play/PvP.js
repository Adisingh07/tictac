import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './Play.css';

const initialBoard = Array(9).fill("");

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function PvP() {
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);
  const [board, setBoard] = useState(initialBoard);
  const [playerTurn, setPlayerTurn] = useState("X");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("Player X's Turn");
  const [winningCombo, setWinningCombo] = useState([]);

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

  const handleCellClick = (index) => {
    if (board[index] || winningCombo.length > 0) return;
    const newBoard = [...board];
    newBoard[index] = playerTurn;
    setBoard(newBoard);
    playSound('move.wav');
    vibrate(vibrationStrength);

    const result = checkWin(newBoard);
    if (result) {
      setWinningCombo(result);
      playSound('win.mp3');
      vibrate(vibrationStrength * 2);
      setMessage(`🎉 Player ${playerTurn} Wins!`);
      if (playerTurn === "X") setPlayer1Score(p => p + 1);
      else setPlayer2Score(p => p + 1);
      return;
    }

    if (newBoard.every(cell => cell)) {
      setMessage("😐 It's a Draw!");
      playSound('draw.mp3');
      vibrate(vibrationStrength);
      return;
    }

    const next = playerTurn === "X" ? "O" : "X";
    setPlayerTurn(next);
    setMessage(`Player ${next}'s Turn`);
  };

  const checkWin = (b) => {
    return WIN_COMBOS.find(([a, bIdx, c]) =>
      b[a] && b[a] === b[bIdx] && b[a] === b[c]
    );
  };

  const nextRound = () => {
    setBoard(initialBoard);
    setWinningCombo([]);
    setPlayerTurn(round % 2 === 0 ? "X" : "O"); // alternate starter
    setMessage(`Player ${round % 2 === 0 ? "X" : "O"}'s Turn`);
    setRound(r => r + 1);
  };

  const resetGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setRound(1);
    nextRound();
  };

  return (
    <div className={`pvp-container theme-${theme}`}>
      <h2>PvP Mode - Round {round}</h2>

      <div className="scoreboard">
        <div>Player X: {player1Score}</div>
        <div>Player O: {player2Score}</div>
      </div>

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

export default PvP;
