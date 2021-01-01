import axios from "axios";
import { config } from "../config";

export abstract class SnakeRestClient {

  public static async sendSnakeData(snakeData) {
    return axios.post(`${this.api}/main/send-snake-data/`, snakeData).catch(err => console.log(err));
  }

  public static async predictSnakeDirection(snakeData) {
    return axios.post(`${this.api}/main/predict-snake-direction/`, snakeData).catch(err => console.log(err));
  }

  private static api = config.apiEndpoint;
}
