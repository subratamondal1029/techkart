import { Client, ID, Storage } from "appwrite";

import { appwriteEndpoint, projectId, storageId } from "../config";

class appwriteStorageconfig {
    client = new Client();
    storage;

    constructor (){
        this.client.setEndpoint(appwriteEndpoint).setProject(projectId);
        this.storage = new Storage(this.client);
    }

    async uploadFile(file) {
        try {
            const fileUpload = await this.storage.createFile(storageId, ID.unique(), file);
            if (fileUpload) {
                return fileUpload;
            }else return false
        } catch (error) {
            console.log("uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            const fileDelete = await this.storage.deleteFile(storageId, fileId);
            if (fileDelete) {
                return true;
            }else return false
        } catch (error) {
            console.log("deleteFile :: error", error);
            return false
        }
    }
}

const appWriteStorage = new appwriteStorageconfig();
export default appWriteStorage