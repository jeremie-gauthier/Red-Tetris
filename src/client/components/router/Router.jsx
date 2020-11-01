import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "pages/home/Home";
import Lobbies from "pages/lobbies/Lobbies";
import Lobby from "pages/lobby/LobbyContainer";
import Game from "pages/game/Game";
import FlexBox from "components/flexbox/FlexBox";
import { GameContextProvider } from "store";

/*
 **   You can had any Route you need inside the <Switch />
 **   The component that should be display for this Route
 **     must be passed as children.
 **   Documentation: https://reactrouter.com/web/guides/quick-start
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/rooms">
          <FlexBox
            width="full"
            height="full"
            className="justify-center overflow-hidden relative"
          >
            <Lobbies />
            <Route exact path="/rooms/id" component={Lobby} />
          </FlexBox>
        </Route>

        <Route path="/game">
          <GameContextProvider>
            <Game />
          </GameContextProvider>
        </Route>

        <Route render={() => <h1>Not found!</h1>} />
      </Switch>
    </BrowserRouter>
  );
}
