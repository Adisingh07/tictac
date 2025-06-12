import { useState, useEffect } from "react";
import "./themes.css";

import { AppContext } from "../../context/AppContext";

const boardList = ["classic", "neon", "chalk", "wood", "dots", "paper"];

function Shop() {
  const [selected, setSelected] = useState("classic");
  const [savedTheme, setSavedTheme] = useState("classic");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("board") || "classic";
    setSelected(stored);
    setSavedTheme(stored);
  }, []);

  const handleSelect = (key) => {
    setSelected(key);
    playSound("tap.mp3");
  };
  const playSound = (filename) => {
  const audio = new Audio(`/sounds/${filename}`);
  audio.volume = 0.8; // you can adjust
  audio.play();
};


  const handleSave = () => {
    playSound("click.wav");
    localStorage.setItem("board", selected);
    setSavedTheme(selected);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (<>
  <h2>Select Board Theme</h2>
    <div className="shop-container">
      

      <div className="theme-preview-container">
        {boardList.map((theme) => (
          <div
            key={theme}
            className={`theme-preview ${selected === theme ? "selected-theme" : ""}`}
            onClick={() => handleSelect(theme)}
          >
            <h4>{theme.toUpperCase()}</h4>
            <div className={`theme-board theme-${theme}`}>
              {Array(9).fill(null).map((_, i) => (
                <div key={i} className="cell">
                  <span className={`xo xo-${theme}`}>{i % 2 === 0 ? "X" : "O"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      
    </div><div className="save">
    {/* ✅ Save Button */}
      <button
        className="save-btn"
        onClick={handleSave}
        disabled={savedTheme === selected}
      >
        Save Changes
      </button>
<div></div>
      {/* ✅ Popup */}
      {showPopup && (
        <div className="popup-confirm">
          <p>✅ Theme changed successfully!</p>
        </div>
      )}</div>
    </>
  );
}

export default Shop;
