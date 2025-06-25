import baseService from "./service.base";

class ContactService extends baseService {
  send({ name, email, message, captcha }) {
    return this.handler(async () => {
      const response = await this.api.post("/contact", {
        name,
        email,
        message,
        captcha,
      });
      return response.data;
    }, "Sending contact");
  }
}

export default new ContactService();
