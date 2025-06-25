export default class ApiResponse {
  constructor(status = 200, message = "Success", data = {}) {
    this.success = status < 400;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
