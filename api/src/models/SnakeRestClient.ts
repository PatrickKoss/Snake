import axios from "axios";
import { config } from "../config";

export abstract class SnakeRestClient {

  public static async sendSnakeData(snakeData) {
    return axios.post(`${this.api}/main/send-snake-data/`, snakeData);
  }

  public static async predictSnakeDirection(snakeData) {
    return axios.post(`${this.api}/main/predict-snake-direction/`, snakeData);
  }

  private static api = config.apiEndpoint;
}
