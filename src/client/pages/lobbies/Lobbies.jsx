import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { StoreContext } from "store";
import useNavigate from "hooks/useNavigate";
import { LOBBIES } from "../../../config/actions/lobbies";
import LobbyItem from "./lobbies/LobbyItem";
import CreateLobby from "./lobby/CreateLobby";
import Overlay from "components/overlay/Overlay";
import SearchLobby from "./lobbies/SearchLobby";
import "./lobbies.scss";
import LobbyContainer from "./lobby/LobbyContainer";

export default function Lobbies() {
  const { state, dispatch } = React.useContext(StoreContext);
  const { navigate } = useNavigate();
  const [hasClickedCreate, setHasClickedCreate] = React.useState(false);

  React.useEffect(() => {
    if (!Object.keys(state.player).length) {
      navigate("/");
    }
    state.socket.emit(LOBBIES.SUBSCRIBE);
  }, []);

  const closeCreate = () => {
    setHasClickedCreate(false);
  };

  return (
    <FlexBox
      height="full"
      width="full"
      direction="col"
      className="pl-24 pt-8 pb-8 justify-start overflow-hidden relative"
    >
      {hasClickedCreate && (
        <Overlay
          isOpen={hasClickedCreate}
          close={closeCreate}
          children={<CreateLobby close={closeCreate} />}
          className="create-modal"
        />
      )}
      <LobbyList state={state} />

      <ButtonsLobbies>
        <PlayButton players={state.players} />
        <CreateButton onClick={() => setHasClickedCreate(true)} />
      </ButtonsLobbies>

      <LobbyContainer />
    </FlexBox>
  );
}

const LobbyList = ({ state }) => (
  <FlexBox direction="col" className="h-4/5">
    <SearchLobby />
    <div className="overflow-y-scroll max-h-4/5 lobby">
      {Object.entries(state.lobbies || {}).map(([key, el], index) => {
        return <LobbyItem lobby={el} key={index} />;
      })}
    </div>
  </FlexBox>
);

const ButtonsLobbies = ({ children }) => (
  <FlexBox width="3/4" direction="row" className="justify-between">
    {children}
  </FlexBox>
);

const PlayButton = ({ players }) => (
  <button className="w-3/5 text-center bg-red-400 hover:bg-red-600 p-2 rounded-lg shadow-lg">
    <FlexBox direction="col">
      <span className="text-base text-white">Play Game</span>
      <span className="text-s text-white">
        {Object.keys(players).length} players connected
      </span>
    </FlexBox>
  </button>
);

const CreateButton = ({ onClick, ...rest }) => (
  <button
    className="text-base w-1/3 text-center bg-red-400 hover:bg-red-600 p-2 rounded-lg shadow-lg"
    onClick={onClick}
  >
    <span className="text-base text-white">Create Lobby</span>
  </button>
);