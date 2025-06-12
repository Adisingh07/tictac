import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function SoundButton({ onClick, children, className = "", ...props }) {
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const handleClick = (e) => {
    if (soundOn) {
      const audio = new Audio("/sounds/click.wav");
      audio.volume = soundVolume ?? 1;
      audio.play();
    }

    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength || 50);
    }

    if (onClick) onClick(e);
  };

  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default SoundButton;
