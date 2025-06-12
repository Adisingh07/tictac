import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // adjust path if needed
import SoundButton from "../../components/SoundButton"; // adjust path if needed
import "./PvAI.css";

function PvAI() {
  const navigate = useNavigate();
  const [name, setName] = useState("Player");
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const handleSelectMode = (mode) => {
    // Sound and vibration on button click
    if (soundOn) {
      const audio = new Audio("/sounds/click.wav");
      audio.volume = soundVolume ?? 1;
      audio.play();
    }
    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength);
    }

    navigate(`/ai-${mode}`, {
      state: {
        player: name || "Player",
      },
    });
  };

  return (
    <div className="setup-container">
      <h2>Player vs AI</h2>

      <label htmlFor="name">Enter your name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player"
      />

      <label>Select Difficulty</label>
      <div className="radio-group">
        <SoundButton className="start-btn" onClick={() => handleSelectMode("easy")}>
          Easy
        </SoundButton>
        <SoundButton className="start-btn" onClick={() => handleSelectMode("medium")}>
          Medium
        </SoundButton>
        <SoundButton className="start-btn" onClick={() => handleSelectMode("hard")}>
          Hard
        </SoundButton>
      </div>
    </div>
  );
}

export default PvAI;
