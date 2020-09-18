import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { List } from "components/list/List";
import { setLobby } from "actions/store";
import { LOBBY } from "../../../config/actions/lobby";

export default function ({ state, dispatch }) {
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (state.lobbyResponse.action === LOBBY.SUBSCRIBE) {
      if (state.lobbyResponse.type === "error") {
        console.log("There was an error with lobby:response");
        setError(state?.lobbyResponse?.reason);
      } else if (state.lobbyResponse.type === "success") {
        console.log("Lobby joined :", state.lobbyResponse.payload);
        dispatch(setLobby(state.lobbyResponse.payload));
      }
    }
  }, [state.lobbyResponse]);

  const subscribeLobby = (lobby) => {
    state.socket.emit(LOBBY.SUBSCRIBE, {
      lobbyId: lobby.id,
      playerId: state.player.id,
    });
  };

  return (
    <FlexBox direction="col" className="overflow-y-scroll max-h-64">
      <List
        object={state.lobbies}
        name="lobby"
        availability={true}
        onClick={subscribeLobby}
        buttonText="Join Lobby"
      />
      <span className="text-red-600">{error}</span>
    </FlexBox>
  );
}