import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState({});
  const { t } = useTranslation();

  React.useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch("http://0.0.0.0:3004/score", {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => setLeaderboard(data.leaderboard))
      .catch((err) => console.log(err));
  });

  return (
    <div className="flex flex-1 flex-col justify-center pt-24">
      <Link to="/">{t("pages.lobbies.go_back_home")}</Link>
      <ol>
        {Object.entries(leaderboard).map(([playerName, score], idx) => (
          <li key={`${idx}-${playerName}`}>
            {playerName}: {score}
          </li>
        ))}
      </ol>
    </div>
  );
}
