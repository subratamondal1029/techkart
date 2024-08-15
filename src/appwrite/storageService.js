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

  async deleteFile(fileId, delstorageId=storageId) {
    try {
      const fileDelete = await this.storage.deleteFile(delstorageId, fileId);
      if (fileDelete) {
        return true;
      } else return false;
    } catch (error) {
      throw error
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

  async uploadInvoice( pdf, documentId) {
 try {
       const response = await this.storage.createFile(invoiceId, documentId, pdf)
      if (response) {
        return true
      }else return null
    } catch (error) {
      console.log("uploadInvoice :: error", error);
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