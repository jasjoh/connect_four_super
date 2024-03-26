import axios from "axios";
// const axios = require('axios');

const BASE_URL = "http://localhost:3001";

class ConnectFourServerApi {

  /**
   * General wrapper for making requests to the server
   * Leverages axios as the library for handling async communication
   * Returns the contents of the axios response.data on success
   * Throws error if any issue occurs with making the request
   * @param {string} endpoint - the path to the resources
   * @param {object} data - the data (payload) to submit; can be url params or a json body payload
   * @param {string} method - the method associated with the request
   */
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    // const headers = { Authorization: `Bearer ${ShareBnbApi.token}` };
    // this uses the params config key (for GET) and data key (for non-GET) requests
    const params = (method === "get")
      ? data
      : {};

    try {
      const axiosConfig = { url, method, data, params };
      const axiosResponse = await axios(axiosConfig);
      const responseData = axiosResponse.data;
      return responseData;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get a list of all games */
  static async getGames() {
    const data = await ConnectFourServerApi.request(`games`);
    console.log("retrieved games:", data);
    return data.games;
  }

  /** Get a specific game */
  static async getGame(gameId) {
    const data = await ConnectFourServerApi.request(`games/${gameId}`, );
    console.log("retrieved game:", data);
    return data.game;
  }

  /** Get all players */
  static async getPlayers() {
    const data = await ConnectFourServerApi.request(`players`, );
    console.log("retrieved players:", players);
    return data.players;
  }

  /** Get a specific player */
  static async getPlayer(pId) {
    const data = await ConnectFourServerApi.request(`players/${pId}`, );
    console.log("retrieved player:", data);
    return data.player;
  }

  /** Get all players for a specific game */
  static async getPlayersForGame(gameId) {
    const data = await ConnectFourServerApi.request(`games/${gameId}/players`, );
    console.log("retrieved players:", data);
    return data.players;
  }

  /** Get all turns for a specific game */
  static async getTurnsForGame(gameId) {
    const data = await ConnectFourServerApi.request(`games/${gameId}/turns`, );
    console.log("retrieved turns:", data);
    return data.turns;
  }

}
export default ConnectFourServerApi;