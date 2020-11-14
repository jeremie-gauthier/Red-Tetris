import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { LOBBY } from "../../../config/actions/lobby";
import { LOBBIES } from "../../../config/actions/lobbies";
import {
  setLobby,
  setLobbiesResponse,
  setLobbyResponse,
  resetMessages,
} from "actions/store";
import { useHistory } from "react-router-dom";
import useNavigate from "hooks/useNavigate";
import "./Lobby.scss";
import { socket } from "store/middleware";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Crown from "assets/img/crown.png";
import RedCross from "assets/img/red-cross.png";
import ButtonSpecial from "components/button/ButtonSpecial";

export default function Lobby({ state, dispatch }) {
  const notify = (error) => toast.error(error);
  const { navigate } = useNavigate();
  const history = useHistory();

  React.useEffect(() => {
    if (state.lobbyResponse.action === LOBBY.UNSUBSCRIBE) {
      if (state.lobbyResponse.type === "error") {
        notify(state?.lobbyResponse?.reason);
      } else if (state.lobbyResponse.type === "success") {
        dispatch(setLobby({}));
        dispatch(setLobbyResponse({}));
        dispatch(resetMessages());
      }
    } else if (state.lobbyResponse.action === LOBBY.READY) {
      if (state.lobbyResponse.type === "error") {
        notify(state?.lobbyResponse?.reason);
      }
    } else if (state.lobbyResponse.action === LOBBY.START) {
      if (state.lobbyResponse.type === "error") {
        notify(state?.lobbyResponse?.reason);
      }
    } else if (state.lobbyResponse.action === LOBBY.KICK) {
      if (state.lobbyResponse.type === "error") {
        notify(state?.lobbyResponse?.reason);
      }
    }
  }, [state.lobbyResponse]);

  React.useEffect(() => {
    if (state.lobbiesResponse.action === LOBBIES.DELETE) {
      if (state.lobbiesResponse.type === "error") {
        notify(state?.lobbiesResponse?.reason);
      } else if (state.lobbiesResponse.type === "success") {
        dispatch(setLobby({}));
        dispatch(setLobbiesResponse({}));
        dispatch(resetMessages());
      }
    }
  }, [state.lobbiesResponse]);

  React.useEffect(() => {
    if (Object.keys(state.game).length !== 0 && history.action !== "POP") {
      navigate("/game-multi");
    }
  }, [state.game]);

  const kickPlayer = (ownerId, playerId, lobbyId) => {
    socket.emit(LOBBY.KICK, { ownerId, playerId, lobbyId });
  };

  return (
    <FlexBox
      wrap="no-wrap"
      direction="col"
      height="3/5"
      width="full"
      className="justify-between"
    >
      <FlexBox
        direction="row"
        className="justify-between p-6 border-b border-black items-center"
      >
        <h1 className="text-2xl font-bold text-red-600 ">
          {state.lobby?.name}
        </h1>
        <span className="text-2xl font-bold text-red-600">
          {state.lobby?.players?.length}/{state.lobby?.maxPlayer}
        </span>
      </FlexBox>

      <FlexBox
        direction="row"
        width="full"
        className="overflow-y-scroll hide-scroll pl-10 pr-6"
      >
        {Object.entries(state.lobby?.players || {}).map(([key, el]) => (
          <FlexBox
            width="full"
            wrap="no-wrap"
            className="items-center pb-4 word-breaker"
            key={`player-${key}`}
          >
            {el?.player.id !== state?.lobby?.owner?.id &&
              (el?.ready ? (
                <div className="h-4 w-4 rounded-full bg-green-500 mr-4" />
              ) : (
                <div className="h-4 w-4 rounded-full bg-red-500 mr-4" />
              ))}

            {el?.player.id === state?.lobby?.owner?.id && (
              <div className="h-4 w-4 mr-4">
                <img src={Crown} />
              </div>
            )}

            {el?.player.id === state?.player?.id ? (
              <span className="text-green-500">{`${el?.player.name}`}</span>
            ) : (
              <span>{`${el?.player.name}`}</span>
            )}

            {state.lobby.owner.id === state.player.id &&
              el?.player.id !== state?.lobby?.owner?.id && (
                <div
                  className="h-4 w-4 ml-4 cursor-pointer"
                  onClick={() =>
                    kickPlayer(state.player.id, el.player.id, state.lobby.id)
                  }
                >
                  <img src={RedCross} />
                </div>
              )}
          </FlexBox>
        ))}
      </FlexBox>
      <Buttons state={state} owner={state.lobby.owner.id === state.player.id} />
    </FlexBox>
  );
}

const Buttons = ({ state, owner }) => {
  const { t } = useTranslation();
  const unsubscribeLobby = (lobbyId, playerId) => {
    socket.emit(LOBBY.UNSUBSCRIBE, { lobbyId, playerId });
  };

  const deleteLobby = (lobbyId, playerId) => {
    // check for ownerId?
    socket.emit(LOBBIES.DELETE, { lobbyId, ownerId: playerId });
  };

  const setReady = (lobbyId, playerId) => {
    socket.emit(LOBBY.READY, { lobbyId, playerId });
  };

  const launchGame = (lobbyId, ownerId) => {
    socket.emit(LOBBY.START, { lobbyId, ownerId });
  };

  const me = state.lobby.players.filter(
    (player) => player.player.id === state.player.id,
  )[0];
  const guests = state.lobby.players.filter(
    (player) => player.player.id !== state.lobby.owner.id,
  );
  const isLaunchable =
    guests.length > 0 && guests.every((guest) => guest.ready);

  return (
    <FlexBox direction="col" className="px-6 py-2">
      <FlexBox direction="row" className="justify-between">
        {owner ? (
          <button
            className={`w-48% red-button ${
              isLaunchable ? "" : "not-"
            }launchable`}
            type="button"
            onClick={() => launchGame(state.lobby.id, state.player.id)}
            disabled={!isLaunchable}
          >
            {t("pages.lobby.launch_game")}
          </button>
        ) : (
          <ButtonSpecial
            width="48%"
            className="red-button launchable"
            type="button"
            onClick={() => setReady(state.lobby.id, state.player.id)}
          >
            {me.ready ? t("pages.lobby.cancel") : t("pages.lobby.ready")}
          </ButtonSpecial>
        )}
        <button
          className="w-48% red-button launchable"
          type="button"
          onClick={() => unsubscribeLobby(state.lobby.id, state.player.id)}
        >
          {t("pages.lobby.leave_lobby")}
        </button>
      </FlexBox>
      {owner && (
        <button
          className="red-button launchable py-2 px-2 mt-2 w-full"
          type="button"
          onClick={() => deleteLobby(state.lobby.id, state.player.id)}
        >
          {t("pages.lobby.delete_lobby")}
        </button>
      )}
    </FlexBox>
  );
};
