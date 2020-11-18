import Joi from "joi";

export const validationAddLobby = {
  name: Joi.string().required().description("The name of the lobby"),
  maxPlayer: Joi.number()
    .required()
    .description("The maximum number of players"),
  owner: Joi.object().required().description("The owner of the lobby"),
};

export const validationDeleteLobby = {
  lobbyId: Joi.string().required().description("The id of the lobby"),
  ownerId: Joi.string().required().description("The id of the user"),
};

export const validationSubscribeLobbies = {};

export const validationunsubscribeLobbies = {};
