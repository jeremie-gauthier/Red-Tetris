import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import Left from "assets/img/left.png";
import SpaceBar from "assets/img/spacebar.png";
import { useTranslation } from "react-i18next";

export default function Helper() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-center">{t("pages.lobbies.helper_title")}</h1>
      <FlexBox direction="col" className="">
        <FlexBox direction="row" className="py-2">
          <img src={Left} className="h-6 mr-2" />
          <span>{t("pages.lobbies.helper_left")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={Left} className="h-6 mr-2 transform rotate-180" />
          <span>{t("pages.lobbies.helper_right")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={Left} className="h-6 mr-2 transform -rotate-90" />
          <span>{t("pages.lobbies.helper_down")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={Left} className="h-6 mr-2 transform rotate-90" />
          <span>{t("pages.lobbies.helper_up")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={SpaceBar} className="h-5 mr-2" />
          <span>{t("pages.lobbies.helper_space")}</span>
        </FlexBox>
      </FlexBox>
    </div>
  );
}
