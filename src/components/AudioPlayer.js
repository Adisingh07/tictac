import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

function AudioPlayer() {
  const context = useContext(AppContext);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!context) return;

    const { musicOn, musicVolume } = context;
    const audio = audioRef.current;

    if (audio) {
      audio.volume = musicVolume;
      if (musicOn) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [context]);

  return (
    <audio ref={audioRef} loop autoPlay>
      <source src="/sounds/menu.mp3" type="audio/mp3" />
    </audio>
  );
}

export default AudioPlayer;
