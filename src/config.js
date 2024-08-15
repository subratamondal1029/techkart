const appwriteEndpoint = import.meta.env.VITE_APPWRITE_END_POINT
const projectId = import.meta.env.VITE_PROJECT_ID
const dataBaseId = import.meta.env.VITE_DATABASE_ID
const storageId = import.meta.env.VITE_STORAGE_ID
const invoiceId = import.meta.env.VITE_INVIOCE_STORAGE_ID
const productCollectionId = import.meta.env.VITE_PRODUCT_COLLECTION_ID
const usersCollectionId = import.meta.env.VITE_USERS_COLLECTION_ID
const ordersCollectionId = import.meta.env.VITE_ORDERS_COLLECTION_ID

export { appwriteEndpoint, projectId, dataBaseId, productCollectionId, usersCollectionId, ordersCollectionId, storageId, invoiceId }