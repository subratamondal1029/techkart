import baseService from "./service.base";

class CartService extends baseService {
  get() {
    return this.handler(async () => {
      const response = await this.api.get("/cart/");
      return response.data;
    }, "fetching cart data");
  }

  update({ id, quantity }) {
    return this.handler(async () => {
      const body = {
        product: {
          productId: id,
          quantity,
        },
      };

      const response = await this.api.put("/cart/", body);
      return response.data;
    }, "updating cart item");
  }
}

export default new CartService();
