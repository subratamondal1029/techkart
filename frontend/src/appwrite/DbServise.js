import { Client, ID, Databases, Query } from "appwrite";
import {
  appwriteEndpoint,
  projectId,
  dataBaseId,
  productCollectionId,
  usersCollectionId,
  ordersCollectionId,
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
        { ...data }
      );

      if (document) {
        return document;
      } else return false;
    } catch (error) {
      console.log("createProduct :: error", error);
      return false;
    }
  }

  async getProducts(query = []) {
    try {
      const products = await this.dataBase.listDocuments(
        dataBaseId,
        productCollectionId,
        query
      );
      if (products) {
        return products.documents;
      } else return null;
    } catch (error) {
      throw error;
    }
  }

  async getProduct(productId) {
    try {
      const product = await this.dataBase.getDocument(
        dataBaseId,
        productCollectionId,
        productId
      );
      if (product) {
        return product;
      } else return null;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(cart, userId, type) {
    cart = cart.map((product) => JSON.stringify(product));

    try {
      let document;
      if (type === "create") {
        document = await this.dataBase.createDocument(
          dataBaseId,
          usersCollectionId,
          userId,
          { cart }
        );
      } else if (type === "update") {
        document = await this.dataBase.updateDocument(
          dataBaseId,
          usersCollectionId,
          userId,
          { cart }
        );
      }

      if (document) {
        return document.cart.map((product) => JSON.parse(product));
      } else return null;
    } catch (error) {
      console.error("addToCart :: error", error);

      throw error;
    }
  }

  async getCart(userId) {
    try {
      const cart = await this.dataBase.getDocument(
        dataBaseId,
        usersCollectionId,
        userId
      );
      if (cart) {
        return cart.cart.map((product) => JSON.parse(product));
      } else return null;
    } catch (error) {
      console.warn(error.message);
      return null
    }
  }

  async createOrder(data, orderId) {
    try {
      const order = await this.dataBase.createDocument(
        dataBaseId,
        ordersCollectionId,
        orderId,
        { ...data }
      );

      if (order) {
        return order;
      } else return null;
    } catch (error) {
      console.error("createOrder :: error", error.message);
      throw error
    }
  }

  async addOrder(orders, userId) {

    try {
      const order = await this.dataBase.updateDocument(
        dataBaseId,
        usersCollectionId,
        userId,
        { orders }
      );

      if (order) {
        return order;
      }else return null
    } catch (error) {
      console.error("addOrder :: error", error.message);
      throw error
    }
  }

  async deleteOrder(orderId) {
    try {
      const deleteOrder = await this.dataBase.deleteDocument(dataBaseId, ordersCollectionId, orderId)
      if (deleteOrder) {
        return true
      }return false
    } catch (error) {
      throw error
    }
  }

  async getOrders(query = []) {
    try {
      const orders = await this.dataBase.listDocuments(
        dataBaseId,
        ordersCollectionId,
        query
      )
      
      if (orders) {
        return orders.documents
      }else return null
    } catch (error) {
      console.error("getOrders :: error", error.message);
      return null
    }
  }

  async getOrder(orderId) {
    try {
      const order = await this.dataBase.getDocument(dataBaseId, ordersCollectionId, orderId)
      if (order) {
        return order
      }else return null
    } catch (error) {
      console.log("getOrder :: error", error);
      return null
    }
  }

  async updateOrder(orderId, data){
    try {
      const updateOrder = await this.dataBase.updateDocument(dataBaseId, ordersCollectionId, orderId, {...data})
      if (updateOrder) {
        return true
      }else return false
    } catch (error) {
      console.log("updateOrder :: error", error);
      return false
    }
  }
}

const appWriteDb = new appWriteDbConfig();
export default appWriteDb;
