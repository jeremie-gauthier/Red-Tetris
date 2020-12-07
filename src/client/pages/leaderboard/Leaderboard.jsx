import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FlexBox from "components/flexbox/FlexBox";
import "./Leaderboard.scss";
const host = process.env.REACT_APP_SERVER_HOST || "0.0.0.0:3004";
 
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState({});
  const { t } = useTranslation();
  
  React.useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch(`http://${host}/score`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => setLeaderboard(data.leaderboard))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center pt-24 leaderboard">
      <Link
        className="fixed top-0 left-0 pt-1 px-1 mt-1 ml-16
        text-sm border rounded shadow"
        to="/"
      >
        {t("pages.lobbies.go_back_home")}
      </Link>
      <h1 className="text-center">Leaderboard</h1>
      <FlexBox direction="col" className="">
        {Object.entries(leaderboard).map(([playerName, score], idx) => (
          <FlexBox
            direction="row"
            className="py-2 justify-center"
            key={`${idx}-${playerName}`}
          >
            <span>
              {playerName}: {score}
            </span>
          </FlexBox>
        ))}
      </FlexBox>
    </div>
  );
}
