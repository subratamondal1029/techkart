import baseService from "./service.base";

class ProductService extends baseService {
  create({ name, description, price, tags = [], category, company, image }) {
    return this.handler(async () => {
      const data = {
        name,
        description,
        price,
        tags,
        category,
        company,
        image,
      };

      const response = await this.api.post("/products/", data);
      return response.data;
    }, "creating product");
  }
  getOne(id) {
    return this.handler(async () => {
      const response = await this.api.get(`/products/${id}`);
      return response.data;
    }, "getting product");
  }
  getMany({
    page = 1,
    category = "",
    company = "",
    sort = "a",
    sortBy = "price",
    query,
    isSeller = false,
  }) {
    return this.handler(async () => {
      const queries = [];
      if (category?.trim())
        queries.push(`category=${category?.trim().toLowerCase()}`);
      if (company?.trim())
        queries.push(`company=${company?.trim().toLowerCase()}`);
      if (query?.trim()) queries.push(`query=${query?.trim().toLowerCase()}`);
      if (sort?.trim()) queries.push(`sort=${sort?.trim().toLowerCase()}`);
      if (sortBy?.trim())
        queries.push(`sortBy=${sortBy?.trim().toLowerCase()}`);

      const response = await this.api.get(
        `/products${isSeller ? "/seller" : ""}/?page=${page}&${queries.join(
          "&"
        )}`
      );

      return response.data;
    }, "getting products");
  }
  update({
    id,
    name,
    description,
    price,
    tags = [],
    category,
    company,
    image,
  }) {
    return this.handler(async () => {
      const data = {};
      if (name) data.name = name;
      if (description) data.description = description;
      if (price) data.price = price;
      if (tags) data.tags = tags;
      if (category) data.category = category;
      if (company) data.company = company;
      if (image) data.image = image;

      const response = await this.api.patch(`/products/${id}`, data);
      return response.data;
    }, "updating product");
  }
  delete(id) {
    return this.handler(async () => {
      const response = await this.api.delete(`/products/${id}`);
      return response.data;
    }, "deleting product");
  }
}

export default new ProductService();
