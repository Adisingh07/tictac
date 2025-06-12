import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // Adjust if needed
import SoundButton from "../../components/SoundButton"; // Adjust path if needed
import './PvPSetup.css';

function PvPSetup() {
  const navigate = useNavigate();

  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [boardSize, setBoardSize] = useState(3); // Easy
  const [timer, setTimer] = useState(15); // Default

  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const playSliderSound = () => {
    if (soundOn) {
      const audio = new Audio("/sounds/click.wav");
      audio.volume = soundVolume;
      audio.play();
    }
    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength);
    }
  };

  const handleStart = () => {
    let path = "/play/pvp/easy";
    if (boardSize === 4) path = "/play/pvp/medium";
    if (boardSize === 5) path = "/play/pvp/hard";

    navigate(path, {
      state: {
        player1,
        player2,
        timer,
        boardSize,
      },
    });
  };

  return (<>
    <div className="setup-container">
      <h2>Player Setup</h2>

      <label>
        Player 1 Name (❌ ):
        <input
  className="input-field"
  value={player1}
  onChange={(e) => setPlayer1(e.target.value)}
/>
      </label>

      <label>
        Player 2 Name (⭕ ):
        <input className="input-field" value={player2} onChange={(e) => setPlayer2(e.target.value)}/>
      </label>

      <label>
        Board Size:
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="size"
              value="3"
              checked={boardSize === 3}
              onChange={() => {
                setBoardSize(3);
                playSliderSound();
              }}
            /> Easy (3×3)
          </label>
          <label>
            <input
              type="radio"
              name="size"
              value="4"
              checked={boardSize === 4}
              onChange={() => {
                setBoardSize(4);
                playSliderSound();
              }}
            /> Medium (4×4)
          </label>
          <label>
            <input
              type="radio"
              name="size"
              value="5"
              checked={boardSize === 5}
              onChange={() => {
                setBoardSize(5);
                playSliderSound();
              }}
            /> Hard (5×5)
          </label>
        </div>
      </label>

      <label>
        Turn Timer: <strong>{timer} sec</strong>
        <input
          type="range"
          min="7"
          max="20"
          value={timer}
          onChange={(e) => {
            setTimer(parseInt(e.target.value));
            playSliderSound();
          }}
        />
      </label>

      <SoundButton className="start-btn" onClick={handleStart}>
        Start Game
      </SoundButton>
    </div></>
  );
}

export default PvPSetup;
