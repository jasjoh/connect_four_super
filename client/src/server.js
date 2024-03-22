import axios from "axios";

const BASE_URL = "http://localhost:3000";

class ConnectFourApi {

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
      return data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get a list of all listings*/
  static async getAllGames() {
    const data = await ConnectFourApi.request(`games`);
    console.log("retrieved games:", data);
    return data.games;
  }

}
export default ShareBnbApi;