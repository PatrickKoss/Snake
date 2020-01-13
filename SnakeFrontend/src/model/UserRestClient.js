import axios from "axios";
import { config } from "../config";

export class UserRestClient {
  // Get all systems
  async getUsers() {
    return (await axios.get(`${this.api}/users`)).data;
  }

  async getTestData() {
    return (await axios.get(`${this.api}/main/another`)).data;
  }

  api = config.apiEndpoint;
}
