import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { MESSAGE } from "../../../config/actions/message";
import "./Lobby.scss";
import { socket } from "store/middleware";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function Chat({ height, state }) {
  const { t } = useTranslation();
  const notify = (error) => toast.error(error);
  const [message, setMessage] = React.useState("");

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const scrollDown = () => {
    const divToScrollTo = document.getElementById("chat");
    if (divToScrollTo) {
      divToScrollTo.scrollTop = divToScrollTo.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollDown();
  }, [state.messages]);

  const sendMessage = () => {
    if (message && message.trim() !== "" && message.length <= 150) {
      const sender = state.player.name;
      const lobbyId = state?.lobby?.id;
      socket.emit(MESSAGE.SEND, { message: message.trim(), sender, lobbyId });
    } else {
      notify("Invalid message!");
    }
    setMessage("");
  };

  const submit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <FlexBox
      direction="col"
      wrap="no-wrap"
      height={height}
      width="full"
      className="justify-between"
    >
      <FlexBox
        direction="col"
        wrap="no-wrap"
        width="full"
        height="full"
        className="p-6 justify-around"
      >
        <ul
          id="chat"
          className="overflow-y-scroll hide-scroll h-3/4 w-full
          px-2 shadow-lg bg-grey-100 rounded"
        >
          {state.messages.map((message) => (
            <li
              key={message.id}
              className={`flex flex-col mr-1 ml-1 ${
                message.sender === state.player.name
                  ? "items-end text-right"
                  : "items-start text-left"
              } word-breaker`}
            >
              <FlexBox direction="col" className="w-4/5 mb-1">
                <span className="text-sm text-red-400">{message.sender}</span>
                <span className="text-sm">{message.message}</span>
              </FlexBox>
            </li>
          ))}
        </ul>
        <form onSubmit={submit} className="flex justify-between ">
          <input
            placeholder={t("pages.lobby.type_message")}
            value={message}
            onChange={handleMessage}
            className="w-89% shadow-lg pl-2 bg-grey-100"
            maxLength="150"
          />
          <button
            className="w-1/10 flex-shrink-0 bg-red-400 hover:bg-red-600
            text-sm text-white py-1 px-2 rounded"
            type="submit"
          >
            >
          </button>
        </form>
      </FlexBox>
    </FlexBox>
  );
}
