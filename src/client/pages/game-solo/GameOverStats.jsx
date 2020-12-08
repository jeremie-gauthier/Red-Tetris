import React from "react";
import { Link } from "react-router-dom";
import FlexBox from "components/flexbox/FlexBox";
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
const host = process.env.REACT_APP_SERVER_HOST || "http://0.0.0.0:3004";

export default function GameOverStats({ score, level, linesRemoved }) {
  const { t } = useTranslation();

  return (
    <FlexBox direction="col" className="bg-white py-8 px-16 rounded space-y-3">
      <h2 className="text-2xl font-bold">{t("pages.game.game_over")}</h2>

      <Score score={score} />
      <Level level={level} />
      <LinesRemoved lines={linesRemoved} />

      <SubmitScore score={score} />
      <Link
        to="/"
        className="self-center p-2 bg-red-500 rounded
        w-full text-center text-white font-semibold"
      >
        {t("pages.game.main_menu")}
      </Link>
    </FlexBox>
  );
}

const SubmitScore = ({ score }) => {
  const { t } = useTranslation();
  const [playerName, setPlayerName] = React.useState("");
  const { navigate } = useNavigate();

  const notValid = !playerName || playerName.length === 0;

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (notValid) {
      return false;
    }

    const body = JSON.stringify({ score, playerName });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch(`${host}/score`, {
      method: "POST",
      headers,
      body,
    });

    navigate("/leaderboard");

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder={t("pages.home.player_name")}
        className="rounded border border-red-300 p-2"
      />
      <button
        type="submit"
        className={`self-center p-2 bg-${notValid ? "grey" : "red"}-400 rounded
        w-full text-center text-white font-semibold cursor-${
          notValid ? "default" : "pointer"
        }`}
        disabled={notValid}
      >
        {t("pages.game.submit_score")}
      </button>
    </form>
  );
};

const Score = ({ score }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold">{t("pages.game.score")}:</h3>
      <span className="flex justify-center">{score}</span>
    </div>
  );
};

const Level = ({ level }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold">{t("pages.game.level")}:</h3>
      <span className="flex justify-center">{level}</span>
    </div>
  );
};

const LinesRemoved = ({ lines }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold">
        {t("pages.game.lines_removed_plural")}:
      </h3>
      <span className="flex justify-center">{lines}</span>
    </div>
  );
};
