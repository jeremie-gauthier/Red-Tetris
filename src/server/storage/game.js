import { getComplexObjectFromRedis, setComplexObjectToRedis } from "storage";

export const setGame = async (game) => {
  await setComplexObjectToRedis(`game-${game.id}`, game);
};

export const getGame = async (id) => {
  const game = (await getComplexObjectFromRedis(`game-${id}`)) ?? {};
  return game;
};

export const updateScore = async (gameId, playerId, score) => {
  const game = await getGame(gameId);
  if (Object.keys(game).length === 0) {
    return null;
  }
  const newPlayers = [];
  game.players.forEach((element) => {
    if (element.player.id === playerId) {
      element.score = score;
    }
    newPlayers.push(element);
  });
  game.players = newPlayers;
  return await setGame(game);
};

export const setLoser = async (gameId, playerId) => {
  const game = await getGame(gameId);
  if (Object.keys(game).length === 0) {
    return null;
  }
  const newPlayers = [];
  game.players.forEach((element) => {
    if (element.player.id === playerId) {
      element.loser = true;
    }
    newPlayers.push(element);
  });
  game.players = newPlayers;
  return await setGame(game);
};

export const hasLost = async (gameId, playerId) => {
  const game = await getGame(gameId);
  if (Object.keys(game).length === 0) {
    return null;
  }
  const element = game.players.find(
    (element) => element.player.id === playerId,
  );
  return element?.loser;
};

export const checkForWinner = async (gameId) => {
  const game = await getGame(gameId);
  if (Object.keys(game).length === 0) {
    return null;
  }
  const players = game.players;

  const playersRemaining = nbPlayersRemaining(players);
  if (playersRemaining === 1) {
    const testWinner = isWinnerLastPlayer(players);
    if (testWinner !== null) {
      console.log("i am checking for winner and I found one !");
      console.log(testWinner);
    }
    return testWinner;
  } else if (playersRemaining === 0) {
    const testWinner2 = getHighestScorePlayer(players);
    if (testWinner2 !== null) {
      console.log("i am checking for winner and I found one !");
      console.log(testWinner2);
    }

    return testWinner2;
  }
  return null;
};

const nbPlayersRemaining = (players) => {
  const nbPlayers = players.filter((el) => el.loser === false).length;
  return nbPlayers;
};

const isWinnerLastPlayer = (players) => {
  const winner = players.find((el) => el.loser === false);
  const test = players.some(
    (el) =>
      el.player.id !== winner.id && parseInt(el.score) > parseInt(winner.score),
  );
  if (test) {
    return null;
  }
  return winner;
};

const getHighestScorePlayer = (players) =>
  players.reduce((c, el) => (parseInt(c.score) > parseInt(el.score) ? c : el));
