import axios from "axios";
import {config} from "../config";
import store from "../store/index"

export class LeaderboardRestClient {

  api = config.apiEndpoint;

  /**
   * get the leaderboard from the backend. You can also filter categories.
   * @param category
   * @returns {Promise<T>}
   */
  async getLeaderboard(category) {
    axios.defaults.headers.common['Authorization'] = store.state.token;
    return (await axios.get(`${this.api}/leaderboard/get-scoreboard/`, {params: {category: category}})).data;
  }
}
