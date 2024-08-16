import { Client, Account, ID, OAuthProvider } from "appwrite";
import { appwriteEndpoint, projectId } from "../config";

class appWriteAuthConfig {
  client = new Client();
  account;
  constructor() {
    this.client.setEndpoint(appwriteEndpoint).setProject(projectId);
    this.account = new Account(this.client);
  }

  async createUser({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        const userData = this.emailPassLogin({ email, password });
        if (userData) {
          return userData;
        } else return null;
      } else return null;
    } catch (error) {
      console.log("create user :: error ", error);
      throw error;
    }
  }

  async emailPassLogin({ email, password }) {
    try {
      const userData = await this.account.createEmailPasswordSession(
        email,
        password
      );
      if (userData) {
        return userData;
      } else return null;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const logout = await this.account.deleteSessions();
      if (logout) {
        return logout;
      } else return null;
    } catch (error) {
      throw error;
      console.log("logout :: error ", error);
    }
  }

  async getCurrentUser() {
    try {
      const userData = await this.account.get();
      if (userData) {
        return userData;
      } else return null;
    } catch (error) {
      throw error;
    }
  }

  async loginWithGogle(SuccessRedirect, homepage) {
    try {
      const accountData = this.account.createOAuth2Session(
        OAuthProvider.Google,
        SuccessRedirect,
        homepage
      )
    } catch (error) {
      throw error.message;
    }
  }
}

const appwriteAuth = new appWriteAuthConfig();
export default appwriteAuth;
