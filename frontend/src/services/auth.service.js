import baseService from "./service.base";
import { addAuth, removeAuth } from "./axios";

class AuthService extends baseService {
  createUser({ email, password, name, label = "user" }) {
    return this.handler(async () => {
      const response = await this.api.post("/users/", {
        email,
        password,
        name,
        label,
      });

      const data = await this.emailPassLogin({ email, password });
      return data;
    }, "creating user");
  }

  emailPassLogin({ email, password }) {
    return this.handler(async () => {
      const response = await this.api.post("/users/auth/login", {
        email,
        password,
      });

      addAuth(response.data.data.accessToken);

      return response.data;
    }, "logging in");
  }

  logout() {
    return this.handler(async () => {
      const response = await this.api.delete("/users/auth/logout");
      removeAuth();
      return response.data;
    }, "logging out");
  }

  getCurrentUser() {
    return this.handler(async () => {
      const response = await this.api.get("/users/");

      addAuth(response.headers["x-access-token"]);
      return response.data;
    }, "getting current user");
  }

  updateUser({ avatar, name, email, password }) {
    return this.handler(async () => {
      const body = {};
      if (avatar) body.avatar = avatar;
      if (name?.trim()) body.name = name.trim().toLowerCase();
      if (email?.trim()) body.email = email.trim().toLowerCase();

      if (password) {
        const response = await this.updatePassword({ password });
        if (Object.keys(body).length === 0) {
          return response;
        }
      }

      const response = await this.api.patch("/users/", body);
      return response.data;
    }, "updating user");
  }

  refreshToken(token) {
    return this.handler(async () => {
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

  forgetPassword({ email }) {
    return this.handler(async () => {
      const response = await this.api.post("/users/auth/forget-password", {
        email,
        route: "forget-password/:token",
      });
      return response.data;
    }, "forgetting password");
  }

  verifyToken(token) {
    return this.handler(async () => {
      const response = await this.api.post(`/users/auth/verify-token/${token}`);
      return response.data;
    }, "verifying token");
  }

  updatePassword({ token, password }) {
    return this.handler(async () => {
      const response = await this.api.patch("/users/auth/update-password", {
        token,
        password,
      });
      return response.data;
    }, "updating password");
  }

  loginWithGoggle(SuccessRedirect, failureRedirect) {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_BASE_URL
    }/users/auth/google?success=${SuccessRedirect}&fails=${failureRedirect}`;
  } // NOTE: just call the function it wil not give any client of data it will redirect to the google login page and after login it will redirect to provided url
}

export default new AuthService();
