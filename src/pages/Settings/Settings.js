import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import './Settings.css';

import tune from './tune.mp3';
import click from './click.wav';

function Settings() {
  const navigate = useNavigate();

  const {
    soundOn, setSoundOn,
    musicOn, setMusicOn,
    vibration, setVibration,
    vibrationStrength, setVibrationStrength,
    musicVolume, setMusicVolume,
    soundVolume, setSoundVolume
  } = useContext(AppContext);

  const musicRef = useRef(null);
  const clickRef = useRef(null);
  const musicTimeoutRef = useRef(null);

  useEffect(() => {
    musicRef.current = new Audio(tune);
    clickRef.current = new Audio(click);

    musicRef.current.loop = false;
    clickRef.current.loop = false;

    musicRef.current.volume = musicVolume;
    clickRef.current.volume = soundVolume;
  }, []);

  const playClickSound = () => {
    if (soundOn && clickRef.current) {
      clickRef.current.pause();
      clickRef.current.currentTime = 0;
      clickRef.current.volume = soundVolume;
      clickRef.current.play().catch(() => {});
    }
  };

  const vibrateNow = (ms = vibrationStrength) => {
    if (vibration && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const handleMusicVolumeChange = (e) => {
    const vol = e.target.value / 100;
    setMusicVolume(vol);

    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      musicRef.current.volume = vol;
      musicRef.current.play().catch(() => {});
      clearTimeout(musicTimeoutRef.current);
      musicTimeoutRef.current = setTimeout(() => {
        musicRef.current.pause();
      }, 2500);
    }
  };

  const handleSoundVolumeChange = (e) => {
    const vol = e.target.value / 100;
    setSoundVolume(vol);

    if (clickRef.current) {
      clickRef.current.pause();
      clickRef.current.currentTime = 0;
      clickRef.current.volume = vol;
      clickRef.current.play().catch(() => {});
    }
  };

  const handleSoundToggle = (e) => {
    setSoundOn(e.target.checked);
    playClickSound();
  };

  const handleVibrationToggle = (e) => {
    setVibration(e.target.checked);
    if (e.target.checked) vibrateNow();
  };

  const handleVibrationStrengthChange = (e) => {
    const strength = parseInt(e.target.value);
    setVibrationStrength(strength);
    vibrateNow(strength);
  };

  const goToPage = (path) => {
    playClickSound();
    vibrateNow();
    navigate(path);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <section className="section">
        <h3>Sound</h3>

        <div className="setting-row">
          <label>Music Volume</label>
          <input type="range" min="0" max="100" value={musicVolume * 100} onChange={handleMusicVolumeChange} />
        </div>

        <div className="setting-row">
          <label>Sound Volume</label>
          <input type="range" min="0" max="100" value={soundVolume * 100} onChange={handleSoundVolumeChange} />
        </div>

        <div className="setting-row">
          <label>Enable Sound Effects</label>
          <input type="checkbox" checked={soundOn} onChange={handleSoundToggle} />
        </div>

        <div className="setting-row">
          <label>Enable Background Music</label>
          <input type="checkbox" checked={musicOn} onChange={(e) => setMusicOn(e.target.checked)} />
        </div>
      </section>

      <section className="section">
        <h3>Vibration</h3>
        <div className="setting-row">
          <label>Enable Vibration</label>
          <input type="checkbox" checked={vibration} onChange={handleVibrationToggle} />
        </div>
        <div className="setting-row">
          <label>Vibration Strength</label>
          <input type="range" min="0" max="100" value={vibrationStrength} onChange={handleVibrationStrengthChange} />
        </div>
      </section>

      <section className="section legal">
        <h3>Legal</h3>
        <p><button onClick={() => goToPage("/about")}>About Us</button></p>
        <p><button onClick={() => goToPage("/privacy")}>Privacy Policy</button></p>
        <p><button onClick={() => goToPage("/terms")}>Terms of Service</button></p>
      </section>
    </div>
  );
}

export default Settings;
