import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { StoreContext } from "store";
import useNavigate from "hooks/useNavigate";
import { setPlayer, setPlayerResponse } from "actions/store";
import { PLAYER } from "../../../config/actions/player";
import ButtonSpecial from "components/button/ButtonSpecial";
import { socket } from "store/middleware";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./Home.scss";

export default function InputUserName() {
  const { t } = useTranslation();
  const { state, dispatch } = React.useContext(StoreContext);
  const [playerName, setPlayerName] = React.useState("");
  const { navigate } = useNavigate();
  const notify = (error) => toast.error(error);

  const handlePlayerName = (e) => {
    setPlayerName(e.target.value);
  };

  React.useEffect(() => {
    if (state.playerResponse.action === PLAYER.CREATE) {
      if (state.playerResponse.type === "error") {
        notify(state?.playerResponse?.reason);
      } else if (state.playerResponse.type === "success") {
        dispatch(setPlayer(state.playerResponse.payload));
        dispatch(setPlayerResponse({}));
        navigate("/rooms");
      }
    }
  }, [state.playerResponse]);

  const createPlayer = (event) => {
    event.preventDefault();
    if (playerName && playerName.trim() !== "" && playerName.length > 0) {
      socket.emit(PLAYER.CREATE, { name: playerName });
    } else {
      notify("Invalid username!");
    }
    setPlayerName("");
  };

  return (
    <FlexBox direction="col" className="">
      <form
        className="flex items-center border-red-400 py-2"
        onSubmit={createPlayer}
      >
        <input
          className="user-input"
          type="text"
          placeholder={t("pages.home.player_name")}
          value={playerName}
          onChange={handlePlayerName}
          autoFocus
        />
        <ButtonSpecial className="user-button" type="submit">
          {t("pages.home.new_player")}
        </ButtonSpecial>
      </form>
    </FlexBox>
  );
}
