// src/components/themes/BoardThemes.jsx
import React from "react";
import "./../../styles/themes.css";

const themes = ["classic", "neon", "chalk", "wood", "dots", "paper"];

const BoardThemes = () => {
  return (
    <div className="theme-preview-container">
      {themes.map((theme) => (
        <div key={theme} className="theme-preview">
          <h4>{theme.charAt(0).toUpperCase() + theme.slice(1)}</h4>
          <div className={`theme-board theme-${theme}`}>
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className={`cell`}>
                <span className={`xo xo-${theme}`}>{i % 2 === 0 ? "X" : "O"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardThemes;
