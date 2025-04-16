import api from "./axios";
import requestHandler from "../utils/requestHandler";

class baseService {
  #api;
  #requestHandler;

  constructor() {
    this.#api = api;
    this.#requestHandler = requestHandler;
  }

  get api() {
    return this.#api;
  }

  get hanlder() {
    return this.#requestHandler;
  }
}

export default baseService;
