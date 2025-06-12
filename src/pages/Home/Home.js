import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext'; // Adjust path if needed
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const handleCardClick = (path) => {
    if (soundOn) {
      const audio = new Audio('/sounds/click.wav');
      audio.volume = soundVolume ?? 1;
      audio.play();
    }

    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength);
    }

    navigate(path);
  };

  return (
    <div className="home-container">
      <h1 className="home-logo">Tic Tac Toe</h1>

      <div className="mode-buttons">
        <div className="mode-card" onClick={() => handleCardClick('/play/pvp-setup')}>
          <img src="/assets/icons/pvp.png" alt="Player vs Player" />
        </div>

        <div className="mode-card" onClick={() => handleCardClick('/play/PvAI')}>
          <img src="/assets/icons/ai.png" alt="Player vs AI" />
        </div>

        {/* 
        <div className="mode-card" onClick={() => handleCardClick('/aihardtest')}>
          <img src="/assets/icons/custom.png" alt="Custom Mode" />
          <p>Custom Mode</p>
        </div> 
        */}
      </div>
    </div>
  );
}

export default Home;
