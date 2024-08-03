import { Client, ID, Databases } from "appwrite";
import {
  appwriteEndpoint,
  projectId,
  dataBaseId,
  productCollectionId,
} from "../config";

class appWriteDbConfig {
  client = new Client();
  dataBase;

  constructor() {
    this.client.setEndpoint(appwriteEndpoint).setProject(projectId);
    this.dataBase = new Databases(this.client);
  }

  async createProduct(data) {
    try {
      const document = await this.dataBase.createDocument(
        dataBaseId,
        productCollectionId,
        ID.unique(),
        {...data}
      );

      if (document) {
        return document;
      } else return false;
    } catch (error) {
      console.log("createProduct :: error", error);
      return false;
    }
  }
}

const appWriteDb = new appWriteDbConfig();
export default appWriteDb