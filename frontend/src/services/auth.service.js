import baseService from "./service.base";
import cryptoJS from "crypto-js";
import { addAuth, removeAuth } from "./axios";

const encryptPassword = (password) => {
  const data = JSON.stringify({
    id: crypto.randomUUID(),
    password,
    expire: Date.now() + 10 * 1000,
  });

  const encrypted = cryptoJS.AES.encrypt(
    data,
    process.env.ENCRYPT_KEY
  ).toString();

  return encrypted;
};

class AuthService extends baseService {
  createUser({ email, password, name, label = "user" }) {
    return this.hanlder(async () => {
      const response = await this.api.post("/users/", {
        email,
        password: encryptPassword(password),
        name,
        label,
      });
      return response.data;
    }, "creating user");
  }

  emailPassLogin({ email, password }) {
    return this.hanlder(async () => {
      const response = await this.api.post("/users/auth/login", {
        email,
        password: encryptPassword(password),
      });

      addAuth(response.data.data.accessToken);

      return response.data;
    }, "logging in");
  }

  logout() {
    return this.hanlder(async () => {
      const response = await this.api.delete("/users/auth/logout");
      removeAuth();
      return response.data;
    }, "logging out");
  }

  getCurrentUser() {
    return this.hanlder(async () => {
      const response = await this.api.get("/users/");
      return response.data;
    }, "getting current user");
  }

  updateUser({ avatar, name, email }) {
    return this.hanlder(async () => {
      const body = {};
      if (avatar) body.avatar = avatar;
      if (name.trim()) body.name = name.trim().toLowerCase();
      if (email.trim()) body.email = email.trim().toLowerCase();

      const response = await this.api.patch("/users/", body);
      return response.data;
    }, "updating user");
  }

  refreshToken(token) {
    return this.hanlder(async () => {
      const headers = token ? { "x-refresh-token": token } : {};
      const response = await this.api.post(
        "/users/auth/refresh-tokens",
        {
          refreshToken: token,
        },
        { headers }
      );
      return response.data;
    }, "refreshing token");
  }

  // TODO: add update password service

  loginWithGogle(SuccessRedirect, falureRedirect) {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_BASE_URL
    }/users/auth/google?success=${SuccessRedirect}&fails=${falureRedirect}`;
  } // NOTE: just call the function it wil not give any cient of data it will redirect to the google login page and after login it will redirect to provided url
}

export default new AuthService();
