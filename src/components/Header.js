import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Header.css';
import logo from './logo.png'; 

function Header() {
  const { musicOn, setMusicOn } = useContext(AppContext);

  return (
    <header className="main-header">
      <div className="logo"><img src={logo} alt="logo" /> Tic Tac Toe </div>
      <button
        className="mute-button"
        onClick={() => setMusicOn(!musicOn)}
        title={musicOn ? "Mute" : "Unmute"}
      >
        {musicOn ? "🔊" : "🔇"}
      </button>
    </header>
  );
}

export default Header;
