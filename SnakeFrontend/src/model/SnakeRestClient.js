import axios from "axios";
import { config } from "../config";

export class SnakeRestClient {
  // Get all systems
  async getPlayingField() {
    return (await axios.get(`${this.api}/main/game-field`)).data;
  }

  api = config.apiEndpoint;
}
