import React from "react";
import TetrisTheme from "assets/music/Tetris_theme.ogg";
import TetrisGameOverTheme from "assets/music/Tetris_game_over.ogg";

const AudioTheme = React.memo(({ alive, speedRate }) => {
  const audioRef = React.useRef(null);

  // Due to autoplay policy in chrome, we need to check the play() promise
  //  in order to avoid an error
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
  const playAudio = async () => {
    try {
      window.removeEventListener("mousedown", playAudio);
      window.removeEventListener("keydown", playAudio);
      await audioRef.current.play();
    } catch (err) {
      // Some user event interactions on DOM that will trigger the play again
      window.addEventListener("mousedown", playAudio);
      window.addEventListener("keydown", playAudio);
    }
  };

  React.useEffect(() => {
    if (alive) {
      audioRef.current.src = TetrisTheme;
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      playAudio();
    } else {
      audioRef.current.loop = false;
      audioRef.current.src = TetrisGameOverTheme;
      audioRef.current.playbackRate = 1.0;
      audioRef.current.volume = 1.0;
      playAudio();
    }

    return () => {
      audioRef.current.src = null;
    };
  }, [alive]);

  React.useEffect(() => {
    audioRef.current.playbackRate = speedRate;
  }, [speedRate]);

  return <audio ref={audioRef} />;
});

export default AudioTheme;
