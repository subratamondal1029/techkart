import baseService from "./service.base";

class OrderService extends baseService {
  getPaymentData({ amount }) {
    return this.handler(async () => {
      const response = await this.api.post("/orders/payment/order/", {
        amount,
      });
      return response.data;
    }, "fetching payment data");
  }

  verifyPayment({ orderId, paymentId }) {
    return this.handler(async () => {
      const body = { orderId };
      if (paymentId) body.paymentId = paymentId;

      const response = await this.api.post("/orders/payment/status", body);
      return response.data;
    }, "verifying payment");
  }

  create({ cartId, paymentId, customerName, customerPhone, customerAddress }) {
    return this.handler(async () => {
      const body = {
        cartId,
        paymentId,
        customerName,
        customerPhone,
        customerAddress,
      };
      const response = await this.api.post("/orders/", body);
      return response.data;
    }, "creating order");
  }

  getOne(id) {
    return this.handler(async () => {
      const response = await this.api.get(`/orders/${id}`);
      return response.data;
    }, "fetching order details");
  }

  getMany({ page }) {
    return this.handler(async () => {
      const response = await this.api.get(`/orders/?page=${page}`);
      return response.data;
    }, "fetching multiple orders");
  }

  update({ id, customerName, customerPhone, customerAddress }) {
    return this.handler(async () => {
      const body = {};
      if (customerName) body.customerName = customerName;
      if (customerPhone) body.customerPhone = customerPhone;
      if (customerAddress) body.customerAddress = customerAddress;

      const response = await this.api.patch(`/orders/${id}`, body);
      return response.data;
    }, "updating order");
  }

  cancel(id) {
    return this.handler(async () => {
      const response = await this.api.delete(`/orders/${id}`);
      return response.data;
    }, "cancelling order");
  }

  changeStatus({ id, isDelivered, isShipped, orderRoute }) {
    return this.handler(async () => {
      const body = {};
      if (isShipped) {
        body.isShipped = isShipped;
      } else if (isDelivered) {
        body.isDelivered = isDelivered;
        if (!orderRoute) throw new Error("Order route is required");
        body.orderRoute = orderRoute;
      }

      const response = await this.api.patch(`/orders/${id}`, body);
      return response.data;
    }, "changing order status");
  }
}

export default new OrderService();
