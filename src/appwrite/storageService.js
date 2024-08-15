import { Client, ID, Storage } from "appwrite";

import { appwriteEndpoint, projectId, storageId, invoiceId } from "../config";

class appwriteStorageconfig {
  client = new Client();
  storage;

  constructor() {
    this.client.setEndpoint(appwriteEndpoint).setProject(projectId);
    this.storage = new Storage(this.client);
  }

  async uploadFile(file) {
    try {
      const fileUpload = await this.storage.createFile(
        storageId,
        ID.unique(),
        file
      );
      if (fileUpload) {
        return fileUpload;
      } else return false;
    } catch (error) {
      console.log("uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      const fileDelete = await this.storage.deleteFile(storageId, fileId);
      if (fileDelete) {
        return true;
      } else return false;
    } catch (error) {
      console.log("deleteFile :: error", error);
      return false;
    }
  }

  getImage(imageId) {
    try {
      const image = this.storage.getFilePreview(storageId, imageId);
      if (image) {
        return image;
      } else return false;
    } catch (error) {
      console.log("getImage :: error", error);
      return false;
    }
  }

  async uploadInvoice(type, pdf, documentId) {
    try {
      let response;
      if (type === "shipped") {
        response = await this.storage.createFile(invoiceId, documentId, pdf)
      }else if(type === "delivered"){
        response = await this.storage.updateFile(invoiceId, documentId, pdf)
      }else throw new Error("Invalid type");
  
      if (response) {
        return true
      }else return null
    } catch (error) {
      throw error
    }
  }

  async getDownloadLink(documentId) {
    try {
      const downloadLink = this.storage.getFileDownload(invoiceId, documentId);
      if (downloadLink) {
        return downloadLink.href;
      } else return false;
    } catch (error) {
      throw error
    }
  }
}

const appWriteStorage = new appwriteStorageconfig();
export default appWriteStorage;