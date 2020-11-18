import React from "react";
import TetrisTheme from "assets/music/Tetris_theme.ogg";
import TetrisGameOverTheme from "assets/music/Tetris_game_over.ogg";
import useAudio from "hooks/useAudio";
import { useTranslation } from "react-i18next";
import { GameContext } from "store";

export default function SoundToggler({ speedRate, ...rest }) {
  const { state } = React.useContext(GameContext);
  const { t } = useTranslation();
  const [soundState, setSoundState] = React.useState(true);

  const toggle = React.useCallback(() => {
    setSoundState((oldState) => {
      if (state.alive) {
        if (oldState) {
          pauseMain();
        } else {
          playMain();
        }
      } else if (!state.alive) {
        if (oldState) {
          pauseGameOver();
        } else {
          playGameOver();
        }
      }

      return !oldState;
    });
  }, [state.alive]);

  const options = {
    volume: 0.15,
    loop: true,
    playbackRate: speedRate,
  };
  const [playMain, pauseMain, setOptions] = useAudio(TetrisTheme, options);
  const [playGameOver, pauseGameOver] = useAudio(TetrisGameOverTheme);

  React.useEffect(() => {
    if (state.alive && soundState) {
      playMain();
      return () => pauseMain();
    } else if (!state.alive && soundState) {
      playGameOver();
      return () => pauseGameOver();
    }
  }, [state.alive, soundState]);

  React.useEffect(() => {
    setOptions({ ...options, playbackRate: speedRate });
  }, [speedRate]);

  return soundState ? (
    <div onClick={toggle} {...rest}>
      {t("pages.game.sound_on")}
    </div>
  ) : (
    <div onClick={toggle} {...rest}>
      {t("pages.game.sound_off")}
    </div>
  );
}
