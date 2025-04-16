import baseService from "./service.base";

class FileService extends baseService {
  upload({ formData }) {
    return this.hanlder(async () => {
      const response = await this.api.post("/files/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }, "uploading file");
  }
  update({ id, formData }) {
    return this.hanlder(async () => {
      const response = await this.api.patch(`/files/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }, "updating file");
  }
  delete({ id }) {
    return this.hanlder(async () => {
      const response = await this.api.delete(`/files/${id}`);
      return response.data;
    }, "deleting file");
  }
  get({ id }) {
    console.log(id);
    return `${import.meta.env.VITE_BACKEND_BASE_URL}/files/${id}`;
  }
}

export default new FileService();
