import { useCallback } from 'react';

function useSound(audioFile, volume = 1) {
  return useCallback(() => {
    const audio = new Audio(audioFile);
    audio.volume = volume;
    audio.play().catch(() => {}); // Suppress autoplay block error
  }, [audioFile, volume]);
}

export default useSound;
