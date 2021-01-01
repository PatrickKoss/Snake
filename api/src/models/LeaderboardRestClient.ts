import axios from "axios";
import { config } from "../config";

export abstract class LeaderboardRestClient {

  public static async createScore(score_mode_token) {
    let score_category = {category: score_mode_token.mode, score: score_mode_token.score};
    axios.defaults.headers.common['Authorization'] = score_mode_token.token;
    return (await axios.post(`${this.api}/leaderboard/create-score/`, score_category)).data;
  }

  private static api = config.apiEndpoint;
}
