import baseService from "./service.base";

class TestService extends baseService {
  health() {
    return this.hanlder(async () => {
      const { data } = await this.api.get("/test/health");
      return data;
    }, "checking health");
  }

  success() {
    return this.hanlder(async () => {
      const { data } = await this.api.get("/test/success");
      return data;
    }, "getting success response");
  }

  error() {
    return this.hanlder(async () => {
      const { data } = await this.api.get("/test/error");
      return data;
    }, "getting error response");
  }
}

export default new TestService();
