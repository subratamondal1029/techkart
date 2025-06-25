import baseService from "./service.base";

class FileService extends baseService {
  constructor() {
    super();
    this.validate = (file) => {
      if (file === "undefined" || !file) {
        throw new Error("File is required");
      }

      const acceptTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "application/pdf",
      ];
      const MAX_SIZE = 5 * 1024 * 1024;

      if (!acceptTypes.includes(file.type)) {
        throw new Error("Invalid file type");
      } else if (file.size > MAX_SIZE) {
        throw new Error("File size is too large (5MB)");
      }

      return true;
    };
  }

  upload({ formData }) {
    return this.handler(async () => {
      this.validate(formData.get("file"));
      const response = await this.api.post("/files/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }, "uploading file");
  }
  update({ id, formData }) {
    return this.handler(async () => {
      this.validate(formData.get("file"));
      const response = await this.api.patch(`/files/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }, "updating file");
  }
  delete(id) {
    return this.handler(async () => {
      const response = await this.api.delete(`/files/${id}`);
      return response.data;
    }, "deleting file");
  }
  get(id) {
    return `${import.meta.env.VITE_BACKEND_BASE_URL}/files/${id}`;
  }
}

export default new FileService();
