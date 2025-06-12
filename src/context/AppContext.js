import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => getStored("sound", true));
  const [musicOn, setMusicOn] = useState(() => getStored("music", true));
  const [vibration, setVibration] = useState(() => getStored("vibration", true));
  const [musicVolume, setMusicVolume] = useState(() => getStored("musicVolume", 0.5));
  const [soundVolume, setSoundVolume] = useState(() => getStored("soundVolume", 0.5));
  const [vibrationStrength, setVibrationStrength] = useState(() => getStored("vibrationStrength", 50));

  useEffect(() => {
    localStorage.setItem("sound", JSON.stringify(soundOn));
    localStorage.setItem("music", JSON.stringify(musicOn));
    localStorage.setItem("vibration", JSON.stringify(vibration));
    localStorage.setItem("musicVolume", musicVolume);
    localStorage.setItem("soundVolume", soundVolume);
    localStorage.setItem("vibrationStrength", vibrationStrength);
  }, [soundOn, musicOn, vibration, musicVolume, soundVolume, vibrationStrength]);

  function getStored(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  return (
    <AppContext.Provider value={{
      soundOn, setSoundOn,
      musicOn, setMusicOn,
      vibration, setVibration,
      musicVolume, setMusicVolume,
      soundVolume, setSoundVolume,
      vibrationStrength, setVibrationStrength
    }}>
      {children}
    </AppContext.Provider>
  );
}
