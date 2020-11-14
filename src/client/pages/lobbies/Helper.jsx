import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import ArrowUp from "assets/img/up.png";
import SpaceBar from "assets/img/spacebar.png";
import { useTranslation } from "react-i18next";

export default function Helper({ close }) {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-center">How to play</h1>
      <FlexBox direction="col" className="">
        <FlexBox direction="row" className="py-2">
          <img src={ArrowUp} className="h-6 mr-2" />
          <span>{t("pages.lobbies.create_lobby")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={ArrowUp} className="h-6 mr-2" />
          <span>{t("pages.lobbies.create_lobby")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={ArrowUp} className="h-6 mr-2" />
          <span>{t("pages.lobbies.create_lobby")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={ArrowUp} className="h-6 mr-2" />
          <span>{t("pages.lobbies.create_lobby")}</span>
        </FlexBox>
        <FlexBox direction="row" className="py-2">
          <img src={SpaceBar} className="h-6 mr-2" />
          <span>{t("pages.lobbies.create_lobby")}</span>
        </FlexBox>
      </FlexBox>
    </div>
  );
}
