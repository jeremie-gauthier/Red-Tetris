import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { StoreContext } from "store";
import useNavigate from "hooks/useNavigate";
import { setPlayer, setPlayerResponse } from "actions/store";
import { PLAYER } from "../../../config/actions/player";
import ButtonSpecial from "components/button/ButtonSpecial";
import { socket, socketPlayerOn, socketPlayerOff } from "store/middleware";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function InputUserName() {
  const { t } = useTranslation();
  const { state, dispatch } = React.useContext(StoreContext);
  const [playerName, setPlayerName] = React.useState("");
  const { navigate } = useNavigate();
  const notify = (error) => toast.error(error);

  React.useEffect(() => {
    socketPlayerOn(dispatch);
    // return () => {
    //   socketPlayerOff();
    // };
  }, []);

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
    socket.emit(PLAYER.CREATE, { name: playerName });
  };

  return (
    <FlexBox direction="col" className="">
      <form
        className="flex items-center border-red-400 py-2"
        onSubmit={createPlayer}
      >
        <input
          className="bg-white focus:outline-none focus:shadow-outline
          border border-gray-300 rounded-lg mr-3 py-1 px-2 block w-full
          appearance-none leading-normal"
          type="text"
          placeholder={t("pages.home.player_name")}
          value={playerName}
          onChange={handlePlayerName}
          autoFocus
        />
        <ButtonSpecial
          className="bg-red-400 hover:bg-red-600 text-sm text-white p-2 rounded"
          type="submit"
        >
          {t("pages.home.new_player")}
        </ButtonSpecial>
      </form>
    </FlexBox>
  );
}
